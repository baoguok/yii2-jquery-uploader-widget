// ========================================================================
//	File Uploader
// ========================================================================

(function ($) {
    let items;
    let settings;
    let element;
    let addFileBtn;
    let container;
    let fileCount = 0;
    let multiple = false;
    let allFiles = [];

    function _upload() {
        console.log(settings.ajax.url);
        let form = new FormData();
        form.append('files', allFiles);
        console.log(form);
        $.ajax({
            url: settings.ajax.url,
            method: 'post',
            data: {
                file: element
            },
            success: function (data) {
                console.log(data);
            }
        });
    }

    $.fn.fileUploader = function (options) {

        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            alert('The File APIs are not fully supported in this browser.');
            return;
        }
        // This is the easiest way to have default options.
        settings = $.extend({
            // These are the defaults.
            ajax: {
                url: null
            },
            imageTemplate: "<div class='file-preview'><img src='{url}' alt='{name}'></div>"
        }, options);
        element = this;
        if(element.attr('multiple')){
            multiple = true;
            // element.removeAttr('multiple');
        }else{
            multiple = false;
        }
        container = element.parent();
        addFileBtn = container.find(".add-file");


        $(container).on('click', '.add-file', function (e) {
            e.preventDefault();
            element.click();
        });

        $(element).on('change', function (evt) {
            let files = evt.target.files; // FileList object
            let newFiles=[];
            for(let index = 0; index < files.length; index++) {
                let file = files[index];
                newFiles.push(file);
                if(multiple){
                    allFiles.push(file);
                }else{
                    allFiles = newFiles;
                }
            }


            console.log(allFiles);

            // Clear old previews
            container.find('.file-preview').remove();

            newFiles.forEach(file => {
                // Loop through the FileList and render image files as thumbnails.
                console.log(file);
                // for (let i = 0, f; f = file[i]; i++) {
                    let f = file;
                    let reader = new FileReader();

                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                        return function(e) {
                            // Render thumbnail.
                            let tmplate = settings.imageTemplate.replace("{url}", e.target.result);
                            tmplate = tmplate.replace("{name}", escape(theFile.name));
                            fileCount++;
                            let fileElement = $(tmplate);
                            fileElement.data('fileData', file);


                            // Only process image files.
                            if (!f.type.match('image.*')) {
                                fileElement.find('img').css('display', 'none');
                            }

                            // If in multiple mode rleave it and if not remove old preview.
                            // if(!multiple){
                            //     container.find('.file-preview').remove();
                            // }

                            addFileBtn.before(fileElement);

                            fileElement.click(function(event) {
                                let fileElement = $(event.target);
                                let indexToRemove = allFiles.indexOf(fileElement.data('fileData'));
                                fileElement.parent().remove();
                                allFiles.splice(indexToRemove, 1);
                                console.warn(allFiles);
                            });
                        };
                    })(f);

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(f);
                // }
            });
        });

        return{
            upload: _upload
        }
    };

    $.fn.fileUploader.upload = function () {
        _upload();
    }

}(jQuery));