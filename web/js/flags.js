function refreshMask(that, input, immunity, immunities) {
    if($(that).hasClass('active')) {
        $(that).removeClass('active');
        input.val(immunities - immunity);
    } else {
        $(that).addClass('active');
        input.val(immunities + immunity);
    }
}

function check(listId, Binary) {
    if(Binary & 0x1) { $('ul#'+listId+' li.1').addClass('active'); } else { $('ul#'+listId+' li.1').removeClass('active'); }
    if(Binary & 0x2) { $('ul#'+listId+' li.2').addClass('active'); } else { $('ul#'+listId+' li.2').removeClass('active'); }
    if(Binary & 0x4) { $('ul#'+listId+' li.4').addClass('active'); } else { $('ul#'+listId+' li.4').removeClass('active'); }
    if(Binary & 0x8) { $('ul#'+listId+' li.8').addClass('active'); } else { $('ul#'+listId+' li.8').removeClass('active'); }
    if(Binary & 0x10) { $('ul#'+listId+' li.16').addClass('active'); } else { $('ul#'+listId+' li.16').removeClass('active'); }
    if(Binary & 0x20) { $('ul#'+listId+' li.32').addClass('active'); } else { $('ul#'+listId+' li.32').removeClass('active'); }
    if(Binary & 0x40) { $('ul#'+listId+' li.64').addClass('active'); } else { $('ul#'+listId+' li.64').removeClass('active'); }
    if(Binary & 0x80) { $('ul#'+listId+' li.128').addClass('active'); } else { $('ul#'+listId+' li.128').removeClass('active'); }
    if(Binary & 0x100) { $('ul#'+listId+' li.256').addClass('active'); } else { $('ul#'+listId+' li.256').removeClass('active'); }
    if(Binary & 0x200) { $('ul#'+listId+' li.512').addClass('active'); } else { $('ul#'+listId+' li.512').removeClass('active'); }
    if(Binary & 0x400) { $('ul#'+listId+' li.1024').addClass('active'); } else { $('ul#'+listId+' li.1024').removeClass('active'); }
    if(Binary & 0x800) { $('ul#'+listId+' li.2048').addClass('active'); } else { $('ul#'+listId+' li.2048').removeClass('active'); }
    if(Binary & 0x1000) { $('ul#'+listId+' li.4096').addClass('active'); } else { $('ul#'+listId+' li.4096').removeClass('active'); }
    if(Binary & 0x2000) { $('ul#'+listId+' li.8192').addClass('active'); } else { $('ul#'+listId+' li.8192').removeClass('active'); }
    if(Binary & 0x4000) { $('ul#'+listId+' li.16384').addClass('active'); } else { $('ul#'+listId+' li.16384').removeClass('active'); }
    if(Binary & 0x8000) { $('ul#'+listId+' li.32768').addClass('active'); } else { $('ul#'+listId+' li.32768').removeClass('active'); }
    if(Binary & 0x10000) { $('ul#'+listId+' li.65536').addClass('active'); } else { $('ul#'+listId+' li.65536').removeClass('active'); }
    if(Binary & 0x20000) { $('ul#'+listId+' li.131072').addClass('active'); } else { $('ul#'+listId+' li.131072').removeClass('active'); }
    if(Binary & 0x40000) { $('ul#'+listId+' li.262144').addClass('active'); } else { $('ul#'+listId+' li.262144').removeClass('active'); }
    if(Binary & 0x80000) { $('ul#'+listId+' li.524288').addClass('active'); } else { $('ul#'+listId+' li.524288').removeClass('active'); }
    if(Binary & 0x100000) { $('ul#'+listId+' li.1048576').addClass('active'); } else { $('ul#'+listId+' li.1048576').removeClass('active'); }
    if(Binary & 0x200000) { $('ul#'+listId+' li.2097152').addClass('active'); } else { $('ul#'+listId+' li.2097152').removeClass('active'); }
    if(Binary & 0x400000) { $('ul#'+listId+' li.4194304').addClass('active'); } else { $('ul#'+listId+' li.4194304').removeClass('active'); }
    if(Binary & 0x800000) { $('ul#'+listId+' li.8388608').addClass('active'); } else { $('ul#'+listId+' li.8388608').removeClass('active'); }
    if(Binary & 0x1000000) { $('ul#'+listId+' > li.16777216').addClass('active'); } else { $('ul#'+listId+' > li.16777216').removeClass('active'); }
    if(Binary & 0x2000000) { $('ul#'+listId+' > li.33554432').addClass('active'); } else { $('ul#'+listId+' > li.33554432').removeClass('active'); }
    if(Binary & 0x4000000) { $('ul#'+listId+' > li.67108864').addClass('active'); } else { $('ul#'+listId+' > li.67108864').removeClass('active'); }
    if(Binary & 0x8000000) { $('ul#'+listId+' > li.134217728').addClass('active'); } else { $('ul#'+listId+' > li.134217728').removeClass('active'); }
    if(Binary & 0x10000000) { $('ul#'+listId+' > li.268435456').addClass('active'); } else { $('ul#'+listId+' > li.268435456').removeClass('active'); }
    if(Binary & 0x20000000) { $('ul#'+listId+' > li.536870912').addClass('active'); } else { $('ul#'+listId+' > li.536870912').removeClass('active'); }
    if(Binary & 0x40000000) { $('ul#'+listId+' > li.1073741824').addClass('active'); } else { $('ul#'+listId+' > li.1073741824').removeClass('active'); }
    if(Binary & 0x80000000) { $('ul#'+listId+' > li.2147483648').addClass('active'); } else { $('ul#'+listId+' > li.2147483648').removeClass('active'); }
}

function Hex(d) {
    return "0x" + (+d).toString(16).toUpperCase();
}