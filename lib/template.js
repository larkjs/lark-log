"use strict";
/**
 * Codes come from tinytim.
 */

const start = "{{";
const end = "}}";
const path = "[a-z0-9_][\\.a-z0-9_]*"; // e.g. config.person.name
const pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi");
        
module.exports = (template, data) => {
    // Merge data into the template string
    return template.replace(pattern, (tag, token) => {
        let path = token.split(".");
        let len = path.length;
        let lookup = data;

        for (let i = 0; i < len; i++){
            lookup = lookup[path[i]];
            
            // Property not found
            if (lookup === undefined){
                throw new Error("template engine: '" + path[i] + "' not found in " + tag);
            }
            
            // Return the required value
            if (i === len - 1){
                return lookup;
            }
        }
    });
};
