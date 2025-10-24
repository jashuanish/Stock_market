#include "stock_tracker.h"
#include <time.h>
#include <ctype.h>

// ============================================================================
// UTILITY FUNCTION IMPLEMENTATIONS
// ============================================================================

void get_current_timestamp(char* buffer, size_t size) {
    time_t now = time(NULL);
    struct tm* t = localtime(&now);
    strftime(buffer, size, "%Y-%m-%d %H:%M:%S", t);
}

void display_error(const char* message) {
    char timestamp[64];
    get_current_timestamp(timestamp, sizeof(timestamp));
    fprintf(stderr, "[❌ ERROR] [%s] %s\n", timestamp, message);
}

void display_success(const char* message) {
    char timestamp[64];
    get_current_timestamp(timestamp, sizeof(timestamp));
    printf("[✅ SUCCESS] [%s] %s\n", timestamp, message);
}

int validate_stock_symbol(const char* symbol, char* clean_symbol, size_t size) {
    if (!symbol || strlen(symbol) == 0) return 0;

    size_t len = strlen(symbol);
    if (len >= size) len = size - 1;

    for (size_t i = 0; i < len; i++) {
        if (!isalnum(symbol[i])) return 0;
        clean_symbol[i] = toupper(symbol[i]);
    }

    clean_symbol[len] = '\0';
    return 1;
}

int compare_stock_change(const void* a, const void* b) {
    const Stock* stockA = (const Stock*)a;
    const Stock* stockB = (const Stock*)b;
    if (stockA->change_percent < stockB->change_percent) return 1;
    if (stockA->change_percent > stockB->change_percent) return -1;
    return 0;
}
