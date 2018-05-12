(function() {
    var worker;

    function printConsole(text) {
        $('.console').text($('.console').text() + text + "\n");
    }

    function fileSize(bytes) {
        var exp = Math.log(bytes) / Math.log(1024) | 0;
        var result = (bytes / Math.pow(1024, exp)).toFixed(2);

        return result + ' ' + (exp == 0 ? 'bytes' : 'KMGTPEZY' [exp - 1] + 'B');
    }

    function dataURLtoUint8(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return u8arr;
    }

    function getDownloadLink(fileData, fileName) {
        if (fileName.match(/\.jpeg|\.gif|\.jpg|\.png/)) {
            var blob = new Blob([fileData]);
            var src = window.URL.createObjectURL(blob);
            return src;
        }
    }

    function loadWebWorker() {
        worker = new Worker("js/worker.js");

        worker.onmessage = function(event) {
            var message = event.data;

            if (message.type == "ready") {
                $(".loading").hide();
                $(".loaded").show();

                $("#reset").prop("disabled", false);

            } else if (message.type == "stdout") {
                printConsole(message.data);

            } else if (message.type == "start") {
                printConsole("Start worker...");

            } else if (message.type == "done") {
                var buffers = message.data;

                if (buffers && buffers.length) {
                    buffers.forEach(function(file) {
                        $(".outputSize").text(fileSize(file.data.byteLength));
                        $(".outputImage").attr("src", getDownloadLink(file.data, "output.png"));
                        $(".outputImageArea").show();
                    });
                }
            }
        };
    }

    function progressFile(file) {
        var fileReader = new FileReader();
        fileReader.onload = function(readFile) {
            $(".dragArea").hide();
            $(".inputSize").text(fileSize(file.size));
            $(".inputImage").attr("src", readFile.target.result);
            $(".inputImageArea").show();
            $("#optimize").prop("disabled", false);
            $("#optimize")[0].onclick = function(e) {
                e.preventDefault();

                $(".console").text("");

                var options = $("#options").val().split(" ");
                var args = $("[name=commendOption]:checked").val() == "cjpeg" ? ["-quality", $("#qualityRange").val()] : [];

                options.forEach(function(opt) {
                    if (typeof opt == "string" && opt != "") args.push(opt);
                });

                worker.postMessage({
                    type: $("[name=commendOption]:checked").val(),
                    arguments: args,
                    file: {
                        "name": "input.jpg",
                        "data": dataURLtoUint8(readFile.target.result)
                    }
                });
                $('#optimize').prop("disabled", true);
                $('#optimize')[0].onclick = null;
            };
        };
        fileReader.readAsDataURL(file);
    }

    $(document).ready(function() {
        loadWebWorker();

        $("#fileSelect").on("change", function(e) {
            if (this.files && this.files[0]) {
                if (!this.files[0].name.match(/.(jpg)$/i)) {
                    alert("Please select jpg file.");
                    return;
                }
                progressFile(this.files[0]);
            }
        });

        $(".dragArea").on("dragover", function(e) {
            e.preventDefault();
            $(".dragArea").addClass("hover");
        });

        $(".dragArea").on("dragleave", function(e) {
            e.preventDefault();
            $(".dragArea").removeClass("hover");
        });

        $(".dragArea").on("drop", function(e) {
            e.preventDefault();
            $(".dragArea").removeClass("hover");
            console.log(e);
            if (e.originalEvent.dataTransfer.files.length == 1) {
                progressFile(e.originalEvent.dataTransfer.files[0]);
            }
        });

        $("#reset").on("click", function(e) {
            e.preventDefault();
            $('.console').text("");
            $(".inputImageArea").hide();
            $(".outputImageArea").hide();
            $(".dragArea").show();
            $("#fileSelect").val("");
        });
    });

})();