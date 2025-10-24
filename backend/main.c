/*
 * Smart Stock Tracker - Main Entry Point
 * Fetches live stock data from Finnhub and updates JSON for frontend.
 */

#include "stock_tracker.h"
#include <unistd.h>
#include <time.h>

#define STOCK_COUNT 8
#define REFRESH_INTERVAL 5  // seconds
#define JSON_FILE_PATH "web/stock_data.json"

int main() {
     start_server();
    Stock stocks[STOCK_COUNT];
    const char *symbols[STOCK_COUNT] = {
        "AAPL", "MSFT", "GOOGL", "AMZN",
        "TSLA", "NVDA", "META", "AMD"
    };

    printf("\n╔═══════════════════════════════════════════════════════════╗\n");
    printf("║                 📊 SMART STOCK TRACKER (LIVE)              ║\n");
    printf("╚═══════════════════════════════════════════════════════════╝\n\n");

    if (!initialize_curl()) {
        display_error("Failed to initialize CURL.");
        return 1;
    }

    while (1) {
        printf("🔄 Fetching live stock data from Finnhub...\n");
        int success_count = 0;

        for (int i = 0; i < STOCK_COUNT; i++) {
            printf("   • Fetching %s ... ", symbols[i]);
            if (fetch_stock_data(symbols[i], &stocks[i])) {
                analyze_stock_performance(&stocks[i]);
                printf("✅ $%.2f (%+.2f%%)\n",
                       stocks[i].current_price, stocks[i].change_percent);
                success_count++;
            } else {
                printf("❌ Failed\n");
            }
            usleep(400000); // brief delay between API calls (0.4s)
        }

                if (success_count > 0) {
            write_all_stocks_json(stocks, STOCK_COUNT, "stocks.json");
write_best_stock_json(&stocks[0], "best_stock.json");
write_trending_json(stocks, STOCK_COUNT, "trending.json");


            // ✅ Add this line: Save for debugging / JS reading if needed
            save_stocks_to_file(stocks, STOCK_COUNT, "stock_data.txt");


            printf("\n💾 JSON updated successfully → %s\n", JSON_FILE_PATH);
            time_t now = time(NULL);
            printf("🕒 Last Update: %s\n", ctime(&now));
        } else {
            display_error("No data fetched this cycle.");
        }


        printf("⏳ Waiting %d seconds before next refresh...\n", REFRESH_INTERVAL);
        sleep(REFRESH_INTERVAL);
        printf("\n──────────────────────────────────────────────────────────────\n");
    }

    cleanup_curl();
    return 0;
}
