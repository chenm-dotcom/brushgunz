(function ($) {
    'use strict';

    /* ── Open WP media picker for a list row ─────────────────────────────── */
    $(document).on('click', '.bg-pick', function () {
        var $btn  = $(this);
        var $row  = $btn.closest('.bg-row');
        var frame = wp.media({ title: 'Select Image or Video', button: { text: 'Use this' }, multiple: false });

        frame.on('select', function () {
            var att = frame.state().get('selection').first().toJSON();
            $row.find('.bg-id').val(att.id);
            var $prev = $row.find('.bg-preview').empty();
            if (att.type === 'image') {
                $('<img>').attr('src', att.sizes && att.sizes.medium ? att.sizes.medium.url : att.url).appendTo($prev);
            } else {
                $prev.text('▶ ' + att.filename);
            }
            $btn.text('Change');
            $row.find('.bg-remove').show();
        });

        frame.open();
    });

    /* ── Remove a list row ───────────────────────────────────────────────── */
    $(document).on('click', '.bg-remove', function () {
        $(this).closest('.bg-row').remove();
    });

    /* ── Add a new empty row to a list ──────────────────────────────────── */
    $(document).on('click', '.bg-add-btn', function () {
        var listId = $(this).data('list');
        var name   = $(this).data('name');
        var $row   = $(
            '<div class="bg-row">' +
                '<input type="hidden" name="' + name + '[]" class="bg-id" value="0">' +
                '<div class="bg-preview"></div>' +
                '<button type="button" class="button bg-pick">Upload</button>' +
                '<button type="button" class="button bg-remove" style="display:none">Remove</button>' +
            '</div>'
        );
        $('#' + listId).append($row);
        $row.find('.bg-pick').trigger('click');
    });

    /* ── Single profile photo picker ────────────────────────────────────── */
    $(document).on('click', '.bg-pick-single', function () {
        var frame = wp.media({ title: 'Select Profile Photo', button: { text: 'Use this photo' }, multiple: false });
        frame.on('select', function () {
            var att = frame.state().get('selection').first().toJSON();
            $('#bg-profile-id').val(att.id);
            var $prev = $('#bg-profile-preview').empty();
            $('<img>').attr('src', att.sizes && att.sizes.medium ? att.sizes.medium.url : att.url).appendTo($prev);
            $('.bg-pick-single').text('Change Photo');
            if (!$('.bg-remove-single').length) {
                $('<button type="button" class="button bg-remove-single" style="margin-left:8px">Remove</button>').insertAfter('.bg-pick-single');
            }
            $('.bg-remove-single').show();
        });
        frame.open();
    });

    $(document).on('click', '.bg-remove-single', function () {
        $('#bg-profile-id').val('0');
        $('#bg-profile-preview').empty();
        $('.bg-pick-single').text('Upload Photo');
        $(this).hide();
    });

})(jQuery);
