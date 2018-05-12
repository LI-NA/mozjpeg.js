function djpeg(file, options, printFunction) {
    if (typeof file === 'undefined')
        return;

    var stdout = "";
    var stderr = "";

    // Default arguments. set output file
    var args = ['-outfile', '/output.jpg'];


    // You also can use array of options.
    if (Array.isArray(options)) {
        args = args.concat(options);
    } else {
        // Create command line options to passed using input `options` object
        for (var key in options) {
            if (typeof options[key] == "string") {
                args.push("-" + key);
                if (typeof options[key] !== "boolean") {
                    // option has a value
                    args.push(String(options[key]));
                }
            }
        }
    }

    // Target file name.
    args.push("/input.jpg");

    var Module = {
        "print": function(text) {
            stdout += text + "\n";
            if (typeof printFunction == "function") printFunction(text);
        },
        "printErr": function(text) {
            stderr += text + "\n";
            if (typeof printFunction == "function") printFunction(text);
        },

        // Mounting input file
        "preRun": [function() {
            FS.writeFile("/input.jpg", file, {
                encoding: "binary"
            });
        }],
        "arguments": args,
        "ENVIRONMENT": "SHELL" // maximum compatibility???
    };