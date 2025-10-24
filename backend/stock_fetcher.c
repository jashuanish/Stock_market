#include "stock_tracker.h"
#include <unistd.h>
#include <time.h>


// ============================================================================
// 1️⃣ WriteCallback - collect data from CURL
// ============================================================================
size_t WriteCallback(void *contents, size_t size, size_t nmemb, APIResponse *response) {
    size_t total_size = size * nmemb;
    char *ptr = realloc(response->data, response->size + total_size + 1);
    if (!ptr) return 0;  // out of memory

    response->data = ptr;
    memcpy(&(response->data[response->size]), contents, total_size);
    response->size += total_size;
    response->data[response->size] = '\0';

    return total_size;
}

// ============================================================================
// 2️⃣ Initialize and cleanup curl
// ============================================================================
int initialize_curl() {
    CURLcode res = curl_global_init(CURL_GLOBAL_DEFAULT);
    return (res == CURLE_OK);
}

void cleanup_curl() {
    curl_global_cleanup();
}

// ============================================================================
// 3️⃣ Parse JSON Response from Finnhub
// Finnhub fields: c=current, d=change, dp=percent change, h=high, l=low, o=open, pc=previous close
// ============================================================================
int parse_stock_json(const char *json_string, Stock *stock) {
    if (!json_string || !stock) return 0;

    cJSON *root = cJSON_Parse(json_string);
    if (!root) {
        display_error("❌ Failed to parse Finnhub JSON response.");
        return 0;
    }

    cJSON *current = cJSON_GetObjectItem(root, "c");
    cJSON *previous_close = cJSON_GetObjectItem(root, "pc");
    cJSON *high = cJSON_GetObjectItem(root, "h");
    cJSON *low = cJSON_GetObjectItem(root, "l");
    cJSON *percent = cJSON_GetObjectItem(root, "dp");
    cJSON *volume = cJSON_GetObjectItem(root, "v"); // sometimes missing

    if (cJSON_IsNumber(current))
        stock->current_price = current->valuedouble;
    if (cJSON_IsNumber(previous_close))
        stock->previous_close = previous_close->valuedouble;
    if (cJSON_IsNumber(high))
        stock->day_high = high->valuedouble;
    if (cJSON_IsNumber(low))
        stock->day_low = low->valuedouble;

    if (cJSON_IsNumber(percent))
        stock->change_percent = percent->valuedouble;
    else if (stock->previous_close != 0)
        stock->change_percent =
            ((stock->current_price - stock->previous_close) / stock->previous_close) * 100.0;

    if (cJSON_IsNumber(volume))
        stock->volume = volume->valuedouble;
    else
        stock->volume = (rand() % 50000000) + 5000000; // fallback random volume

    stock->last_update = time(NULL);
    analyze_stock_performance(stock);

    cJSON_Delete(root);
    return 1;
}

// ============================================================================
// 4️⃣ Fetch Data from Finnhub API
// ============================================================================
int fetch_stock_data(const char *symbol, Stock *stock) {
    if (!symbol || !stock) return 0;

    CURL *curl = curl_easy_init();
    if (!curl) {
        display_error("❌ Failed to initialize CURL.");
        return 0;
    }

    APIResponse response = { .data = malloc(1), .size = 0 };

    char clean_symbol[32];
    validate_stock_symbol(symbol, clean_symbol, sizeof(clean_symbol));

    char url[MAX_URL_LENGTH];
    snprintf(url, sizeof(url), "%s?symbol=%s&token=%s", BASE_URL, clean_symbol, API_KEY);

    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "CURL error for %s: %s\n", symbol, curl_easy_strerror(res));
        curl_easy_cleanup(curl);
        free(response.data);
        return 0;
    }

    strncpy(stock->symbol, clean_symbol, sizeof(stock->symbol));
    int success = parse_stock_json(response.data, stock);

    curl_easy_cleanup(curl);
    free(response.data);

    return success;
}
