#include "stock_tracker.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// Save stock data to file
int save_stocks_to_file(Stock stocks[], int count, const char* filename) {
    FILE* file = fopen(filename, "w");
    if (!file) {
        display_error("Failed to open stock file for writing.");
        return 0;
    }

    for (int i = 0; i < count; i++) {
        fprintf(file, "%s %.2f %.2f %.2f\n",
                stocks[i].symbol,
                stocks[i].current_price,
                stocks[i].previous_close,
                stocks[i].change_percent);
    }

    fclose(file);
    display_success("Stock data saved successfully.");
    return 1;
}

// Load stock data from file
int load_stocks_from_file(Stock stocks[], int max_count, const char* filename) {
    FILE* file = fopen(filename, "r");
    if (!file) {
        display_error("No saved stock file found.");
        return 0;
    }

    int i = 0;
    while (i < max_count && fscanf(file, "%s %lf %lf %lf",
                                   stocks[i].symbol,
                                   &stocks[i].current_price,
                                   &stocks[i].previous_close,
                                   &stocks[i].change_percent) == 4) {
        i++;
    }

    fclose(file);
    return i;
}

// Generate JSON output file
int generate_json_file(Stock stocks[], int count, const char* filename) {
    FILE* file = fopen(filename, "w");
    if (!file) {
        display_error("Failed to create JSON file.");
        return 0;
    }

    fprintf(file, "{\n  \"stocks\": [\n");
    for (int i = 0; i < count; i++) {
        fprintf(file,
            "    {\"symbol\": \"%s\", \"price\": %.2f, \"change_percent\": %.2f}%s\n",
            stocks[i].symbol,
            stocks[i].current_price,
            stocks[i].change_percent,
            (i == count - 1) ? "" : ",");
    }
    fprintf(file, "  ]\n}\n");

    fclose(file);
    display_success("JSON file generated successfully.");
    return 1;
}

// Log trading or fetch activity
int log_trading_activity(const char* message, Stock* stock) {
    FILE* log_file = fopen("logs/activity.log", "a");
    if (!log_file) {
        display_error("Failed to open log file.");
        return 0;
    }

    time_t now = time(NULL);
    char* timestamp = ctime(&now);
    timestamp[strcspn(timestamp, "\n")] = '\0'; // Remove newline

    fprintf(log_file,
            "[%s] %s | Symbol: %s | Price: %.2f | Change: %.2f%%\n",
            timestamp,
            message,
            stock->symbol,
            stock->current_price,
            stock->change_percent);

    fclose(log_file);
    return 1;
}
