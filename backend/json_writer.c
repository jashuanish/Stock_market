#include <stdio.h>
#include <json-c/json.h>
#include "stock_tracker.h"

void write_all_stocks_json(Stock stocks[], int count, const char* filename) {
    struct json_object* jarray = json_object_new_array();

    for (int i = 0; i < count; i++) {
        // Skip invalid or empty stocks
        if (stocks[i].current_price <= 0) continue;

        struct json_object* jobj = json_object_new_object();
        json_object_object_add(jobj, "symbol", json_object_new_string(stocks[i].symbol));
        json_object_object_add(jobj, "price", json_object_new_double(stocks[i].current_price));
        json_object_object_add(jobj, "change_percent", json_object_new_double(stocks[i].change_percent));
        json_object_array_add(jarray, jobj);
    }

    FILE* fp = fopen(filename, "w");
    if (fp) {
        fputs(json_object_to_json_string_ext(jarray, JSON_C_TO_STRING_PRETTY), fp);
        fclose(fp);
    }

    json_object_put(jarray);
}

void write_best_stock_json(Stock* best, const char* filename) {
    struct json_object* jobj = json_object_new_object();

    if (best != NULL) {
        json_object_object_add(jobj, "symbol", json_object_new_string(best->symbol));
        json_object_object_add(jobj, "price", json_object_new_double(best->current_price));
        json_object_object_add(jobj, "change_percent", json_object_new_double(best->change_percent));
    }

    FILE* fp = fopen(filename, "w");
    if (fp) {
        fputs(json_object_to_json_string_ext(jobj, JSON_C_TO_STRING_PRETTY), fp);
        fclose(fp);
    }

    json_object_put(jobj);
}

void write_trending_json(Stock stocks[], int count, const char* filename) {
    struct json_object* jarray = json_object_new_array();

    for (int i = 0; i < count; i++) {
        if (stocks[i].current_price <= 0) continue;

        struct json_object* jobj = json_object_new_object();
        json_object_object_add(jobj, "symbol", json_object_new_string(stocks[i].symbol));
        json_object_object_add(jobj, "price", json_object_new_double(stocks[i].current_price));
        json_object_object_add(jobj, "change_percent", json_object_new_double(stocks[i].change_percent));
        json_object_array_add(jarray, jobj);
    }

    FILE* fp = fopen(filename, "w");
    if (fp) {
        fputs(json_object_to_json_string_ext(jarray, JSON_C_TO_STRING_PRETTY), fp);
        fclose(fp);
    }

    json_object_put(jarray);
}
