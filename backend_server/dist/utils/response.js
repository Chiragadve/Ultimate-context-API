"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterResponse = filterResponse;
function filterResponse(data, fieldsParam) {
    const fields = fieldsParam.split(',').map(f => f.trim()).filter(f => f.length > 0);
    if (fields.length === 0)
        return data;
    const result = {};
    fields.forEach(path => {
        let src = data;
        let dest = result;
        const parts = path.split('.');
        // Handle root level wildcards or simple keys
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            // Check if source has this property
            if (src === undefined || src === null || typeof src !== 'object' || !(part in src)) {
                return;
            }
            if (i === parts.length - 1) {
                // Leaf node - copy value (ref or primitive)
                dest[part] = src[part];
            }
            else {
                // Intermediate node
                src = src[part];
                if (!dest[part]) {
                    dest[part] = {};
                }
                dest = dest[part];
            }
        }
    });
    // If "ip" was not requested but is critical? No, user gets what they asked for.
    // If result is empty because no fields matched? Return empty obj.
    return result;
}
