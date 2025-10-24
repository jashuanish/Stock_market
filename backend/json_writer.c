#include <stdio.h>
#include "stock_tracker.h"

int write_all_stocks_json(Stock stocks[], int count) {
    FILE *f = fopen("web/stock_data.json", "w");
    if (!f) return 0;

    fprintf(f, "[\n");
    for (int i = 0; i < count; i++) {
        fprintf(f,
            "  {\"symbol\": \"%s\", \"price\": %.2f, \"change_percent\": %.2f, \"volume\": %.2f}%s\n",
            stocks[i].symbol,
            stocks[i].current_price,
            stocks[i].change_percent,
            stocks[i].volume,
            (i == count - 1) ? "" : ","
        );
    }
    fprintf(f, "]\n");
    fclose(f);
    return 1;
}

int write_best_stock_json(Stock stocks[], int count) {
    FILE *f = fopen("web/best_stock.json", "w");
    if (!f) return 0;

    int best_index = 0;
    for (int i = 1; i < count; i++)
        if (stocks[i].change_percent > stocks[best_index].change_percent)
            best_index = i;

    fprintf(f, "{\n  \"symbol\": \"%s\",\n  \"price\": %.2f,\n  \"change_percent\": %.2f\n}\n",
            stocks[best_index].symbol,
            stocks[best_index].current_price,
            stocks[best_index].change_percent);
    fclose(f);
    return 1;
}

int write_trending_json(Stock stocks[], int count) {
    FILE *f = fopen("web/trending.json", "w");
    if (!f) return 0;

    fprintf(f, "[\n");
    for (int i = 0; i < 5 && i < count; i++) {
        fprintf(f,
            "  {\"symbol\": \"%s\", \"change_percent\": %.2f}%s\n",
            stocks[i].symbol,
            stocks[i].change_percent,
            (i == 4 || i == count - 1) ? "" : ","
        );
    }
    fprintf(f, "]\n");
    fclose(f);
    return 1;
}
