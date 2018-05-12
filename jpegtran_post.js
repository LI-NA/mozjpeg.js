    var file = null;

    // Try to get output file.
    try {
        // read processed image data in file
        file = FS.readFile("/output.jpg");
    } catch (e) {
        // Cleaning up input png from MEMFS
        FS.unlink("/input.jpg");
        return new Error("No output file: " + stderr);
    }

    // Cleanup files from
    FS.unlink("/output.jpg");
    FS.unlink("/input.jpg");

    return {
        "data": file,
        "stdout": stdout,
        "stderr": stderr
    };
};


// for npm...
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = jpegtran;
} else {
    jpegtran.call(this);
}