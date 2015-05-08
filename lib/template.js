"use strict";
/**
 * Codes come from tinytim.
 */

var start = "{{",
    end = "}}",
    path = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
    pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi");
        
module.exports = function(template, data){
    // Merge data into the template string
    return template.replace(pattern, function(tag, token){
        var path = token.split("."),
            len = path.length,
            lookup = data,
            i = 0;

        for (; i < len; i++){
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
