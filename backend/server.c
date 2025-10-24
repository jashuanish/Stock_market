#include <microhttpd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define PORT 8080

// ---------------------------------------------------------------------------
// Utility: Read entire file into a string
// ---------------------------------------------------------------------------
char *read_file_to_string(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        fprintf(stderr, "❌ Could not open %s\n", filename);
        return NULL;
    }

    fseek(file, 0, SEEK_END);
    long size = ftell(file);
    rewind(file);

    char *buffer = malloc(size + 1);
    if (!buffer) {
        fclose(file);
        return NULL;
    }

    fread(buffer, 1, size, file);
    buffer[size] = '\0';
    fclose(file);

    return buffer;
}

// ---------------------------------------------------------------------------
// HTTP Response Handler
// ---------------------------------------------------------------------------
enum MHD_Result answer_to_connection(
    void *cls,
    struct MHD_Connection *connection,
    const char *url,
    const char *method,
    const char *version,
    const char *upload_data,
    size_t *upload_data_size,
    void **con_cls
) {
    // ✅ Handle CORS preflight request (OPTIONS)
    if (strcmp(method, "OPTIONS") == 0) {
        struct MHD_Response *response = MHD_create_response_from_buffer(0, "", MHD_RESPMEM_PERSISTENT);
        MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
        MHD_add_response_header(response, "Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        MHD_add_response_header(response, "Access-Control-Allow-Headers", "Content-Type, Authorization");
        MHD_add_response_header(response, "Access-Control-Max-Age", "86400");
        int ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        return ret;
    }

    const char *filepath = NULL;

    if (strcmp(url, "/stocks") == 0)
        filepath = "web/stock_data.json";
    else if (strcmp(url, "/best") == 0)
        filepath = "web/best_stock.json";
    else if (strcmp(url, "/trending") == 0)
        filepath = "web/trending.json";
    else {
        const char *not_found = "{\"error\": \"Invalid endpoint\"}";
        struct MHD_Response *response = MHD_create_response_from_buffer(strlen(not_found),
                                                (void *)not_found, MHD_RESPMEM_PERSISTENT);
        MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
        MHD_add_response_header(response, "Access-Control-Allow-Methods", "GET, OPTIONS");
        MHD_add_response_header(response, "Access-Control-Allow-Headers", "Content-Type, Authorization");
        int ret = MHD_queue_response(connection, MHD_HTTP_NOT_FOUND, response);
        MHD_destroy_response(response);
        return ret;
    }

    char *response_json = read_file_to_string(filepath);
    if (!response_json) {
        const char *error_msg = "{\"error\": \"Could not read file\"}";
        struct MHD_Response *response = MHD_create_response_from_buffer(strlen(error_msg),
                                                (void *)error_msg, MHD_RESPMEM_PERSISTENT);
        MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
        MHD_add_response_header(response, "Access-Control-Allow-Methods", "GET, OPTIONS");
        MHD_add_response_header(response, "Access-Control-Allow-Headers", "Content-Type, Authorization");
        int ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
        MHD_destroy_response(response);
        return ret;
    }

    struct MHD_Response *response = MHD_create_response_from_buffer(strlen(response_json),
                                            (void *)response_json, MHD_RESPMEM_MUST_FREE);
    // ✅ Add CORS headers for React
    MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
    MHD_add_response_header(response, "Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    MHD_add_response_header(response, "Access-Control-Allow-Headers", "Content-Type, Authorization");

    int ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
    MHD_destroy_response(response);
    return ret;
}

// ---------------------------------------------------------------------------
// Server Start Function (replaces main())
// ---------------------------------------------------------------------------
int start_server() {
    struct MHD_Daemon *daemon;

    printf("🌐 Starting C HTTP Server on port %d...\n", PORT);
    printf("Available Endpoints:\n");
    printf("  • /stocks\n");
    printf("  • /best\n");
    printf("  • /trending\n\n");

    daemon = MHD_start_daemon(
        MHD_USE_INTERNAL_POLLING_THREAD,
        PORT,
        NULL, NULL,
        &answer_to_connection, NULL,
        MHD_OPTION_END);

    if (!daemon) {
        fprintf(stderr, "❌ Failed to start server\n");
        return 1;
    }

    printf("✅ Server running! Press ENTER to stop.\n");
    getchar();

    MHD_stop_daemon(daemon);
    printf("🛑 Server stopped.\n");
    return 0;
}
