"use strict";

var Ajax = null;
var EquipID = null;
var Entry = null;
var ID = null;
var NewID = 0;
var EntryName = $('#entry');
var EquipmentID = $('#equipment');

function ModelView(mainhand, offhand) {
    $('#result').append(
        '<div class="col-md-4">' +
        '   <object width="100%" height="300px" type="application/x-shockwave-flash" data="http://wow.zamimg.com/modelviewer/ZAMviewerfp11.swf" id="paperdoll-model-paperdoll-0-equipment-set" style="background: #fff">' +
        '       <param name="quality" value="high">' +
        '       <param name="allowsscriptaccess" value="always">' +
        '       <param name="allowfullscreen" value="true">' +
        '       <param name="menu" value="false">' +
        '       <param name="flashvars" value="model=humanfemale&amp;modelType=16&amp;cls=11&amp;equipList=4,13115,7,13117,13,' + mainhand + ',17,' + offhand + '&amp;sk=3&amp;ha=8&amp;hc=2&amp;fa=5&amp;fh=1&amp;fc=1&amp;mode=3&amp;contentPath=//wow.zamimg.com/modelviewer/&amp;container=paperdoll-model-paperdoll-0-equipment-set&amp;hd=false&amp;">' +
        '       <param name="bgcolor" value="fff"> ' +
        '       <param name="wmode" value="direct">' +
        '   </object>' +
        '</div>');
}

function DisplayRow(Entry, EquipID, ID, data, i) {
    $('#result').append(
        '<div class="col-md-8">' +
        '   <h4>ID : ' + i + '</h4>' +
        '   <div class="col-md-4">' +
        '       <h5>Main Hand</h5>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">DisplayID</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'mh\', \'display\', this.value)" value="' + data.mainhand.displayid + '">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Skill</span>' +
        '           <select class="form-control" id="' + EquipID + '_' + ID + '_mh_skill" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'mh\', \'skill\', this.value)">' +
        '               <option value="">Choose</option>' +
        '               <option value="0">Axe 1H</option>' +
        '               <option value="1">Axe 2H</option>' +
        '               <option value="2">Bow</option>' +
        '               <option value="3">Gun</option>' +
        '               <option value="4">Mace 1H</option>' +
        '               <option value="5">Mace 2H</option>' +
        '               <option value="6">Polearm</option>' +
        '               <option value="7">Sword 1H</option>' +
        '               <option value="8">Sword 2H</option>' +
        '               <option value="10">Staff</option>' +
        '               <option value="11">Exotic 1H</option>' +
        '               <option value="12">Exotic 2H</option>' +
        '               <option value="13">Fist</option>' +
        '               <option value="14">Miscellaneous</option>' +
        '               <option value="15">Dagger</option>' +
        '               <option value="16">Thrown</option>' +
        '               <option value="17">Spear</option>' +
        '               <option value="18">Crossbow</option>' +
        '               <option value="19">Wand</option>' +
        '               <option value="20">Fishing Pole</option>' +
        '           </select>' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Slot</span>' +
        '           <select class="form-control" id="' + EquipID + '_' + ID + '_mh_slot" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'mh\', \'slot\', this.value)">' +
        '               <option value="0">Choose</option>' +
        '               <option value="13">1H Weapon</option>' +
        '               <option value="14">Shield</option>' +
        '               <option value="15">Ranged</option>' +
        '               <option value="17">2H Weapon</option>' +
        '               <option value="21">Weapon Main Hand</option>' +
        '               <option value="22">Weapon Off Hand</option>' +
        '               <option value="23">Holdable</option>' +
        '               <option value="25">Thrown</option>' +
        '               <option value="26">Ranged Right</option>' +
        '           </select>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-md-4">' +
        '       <h5>Off Hand</h5>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">DisplayID</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'oh\', \'display\', this.value)" value="' + data.offhand.displayid + '">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Skill</span>' +
        '           <select class="form-control" id="' + EquipID + '_' + ID + '_oh_skill" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'oh\', \'skill\', this.value)">' +
        '               <option value="">Choose</option>' +
        '               <option value="0">Axe 1H</option>' +
        '               <option value="1">Axe 2H</option>' +
        '               <option value="2">Bow</option>' +
        '               <option value="3">Gun</option>' +
        '               <option value="4">Mace 1H</option>' +
        '               <option value="5">Mace 2H</option>' +
        '               <option value="6">Polearm</option>' +
        '               <option value="7">Sword 1H</option>' +
        '               <option value="8">Sword 2H</option>' +
        '               <option value="10">Staff</option>' +
        '               <option value="11">Exotic 1H</option>' +
        '               <option value="12">Exotic 2H</option>' +
        '               <option value="13">Fist</option>' +
        '               <option value="14">Miscellaneous</option>' +
        '               <option value="15">Dagger</option>' +
        '               <option value="16">Thrown</option>' +
        '               <option value="17">Spear</option>' +
        '               <option value="18">Crossbow</option>' +
        '               <option value="19">Wand</option>' +
        '               <option value="20">Fishing Pole</option>' +
        '           </select>' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Slot</span>' +
        '           <select class="form-control" id="' + EquipID + '_' + ID + '_oh_slot" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'oh\', \'slot\', this.value)">' +
        '               <option value="0">Choose</option>' +
        '               <option value="13">1H Weapon</option>' +
        '               <option value="14">Shield</option>' +
        '               <option value="15">Ranged</option>' +
        '               <option value="17">2H Weapon</option>' +
        '               <option value="21">Weapon Main Hand</option>' +
        '               <option value="22">Weapon Off Hand</option>' +
        '               <option value="23">Holdable</option>' +
        '               <option value="25">Thrown</option>' +
        '               <option value="26">Ranged Right</option>' +
        '           </select>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-md-4">' +
        '       <h5>Ranged</h5>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">DisplayID</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'ranged\', \'display\', this.value)" value="' + data.ranged.displayid + '">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Skill</span>' +
        '           <select class="form-control" id="' + EquipID + '_' + ID + '_ranged_skill" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'ranged\', \'skill\', this.value)">' +
        '               <option value="">Choose</option>' +
        '               <option value="0">Axe 1H</option>' +
        '               <option value="1">Axe 2H</option>' +
        '               <option value="2">Bow</option>' +
        '               <option value="3">Gun</option>' +
        '               <option value="4">Mace 1H</option>' +
        '               <option value="5">Mace 2H</option>' +
        '               <option value="6">Polearm</option>' +
        '               <option value="7">Sword 1H</option>' +
        '               <option value="8">Sword 2H</option>' +
        '               <option value="10">Staff</option>' +
        '               <option value="11">Exotic 1H</option>' +
        '               <option value="12">Exotic 2H</option>' +
        '               <option value="13">Fist</option>' +
        '               <option value="14">Miscellaneous</option>' +
        '               <option value="15">Dagger</option>' +
        '               <option value="16">Thrown</option>' +
        '               <option value="17">Spear</option>' +
        '               <option value="18">Crossbow</option>' +
        '               <option value="19">Wand</option>' +
        '               <option value="20">Fishing Pole</option>' +
        '           </select>' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Slot</span>' +
        '           <select class="form-control" id="' + EquipID + '_' + ID + '_ranged_slot" onchange="update(' + Entry + ', ' + EquipID + ', ' + ID + ', \'ranged\', \'slot\', this.value)">' +
        '               <option value="0">Choose</option>' +
        '               <option value="13">1H Weapon</option>' +
        '               <option value="14">Shield</option>' +
        '               <option value="15">Ranged</option>' +
        '               <option value="17">2H Weapon</option>' +
        '               <option value="21">Weapon Main Hand</option>' +
        '               <option value="22">Weapon Off Hand</option>' +
        '               <option value="23">Holdable</option>' +
        '               <option value="25">Thrown</option>' +
        '               <option value="26">Ranged Right</option>' +
        '           </select>' +
        '       </div>' +
        '   </div>' +
        '</div>');

    $('#' + EquipID + '_' + ID + '_mh_skill').val(data.mainhand.skill);
    $('#' + EquipID + '_' + ID + '_mh_slot').val(data.mainhand.slot);
    $('#' + EquipID + '_' + ID + '_oh_skill').val(data.offhand.skill);
    $('#' + EquipID + '_' + ID + '_oh_slot').val(data.offhand.slot);
    $('#' + EquipID + '_' + ID + '_ranged_skill').val(data.ranged.skill);
    $('#' + EquipID + '_' + ID + '_ranged_slot').val(data.ranged.slot);
}

$('#itemId').keyup(function() {
    var Item = $(this).val();
    var ItemName = $('#item');
    var ItemDisplay = $('#display');
    var ItemEquipInfo = $('#equipinfo');
    var ItemEquipSlot = $('#equipslot');
    var UrlToPass = 'item=' + Item;
    $.ajax({
        type: 'GET',
        data: UrlToPass,
        url: 'item_infos.php',
        dataType: 'json',
        success: function(data) {
            if (data != null) {
                console.log(data);
                ItemName.html(data.name);
                ItemDisplay.attr('value', data.display);
                ItemEquipInfo.attr('value', data.skill);
                ItemEquipSlot.attr('value', data.slot);
            } else {
                alert('Problem with sql query');
            }
        }
    });

    if (Item === '') {
        ItemName.html("ID");
    }
});

$('#entryId').keyup(function() {
    Entry = $(this).val();
    var UrlToPass = 'entry=' + Entry;
    $.ajax({
        type: "POST",
        url: '/equip/',
        data: 'sql=' + generateSQL(Lines) + '&review=' + JSON.stringify(Review),
        success: function (data) {
            console.log(Date() + " - " + data);
        },
        error: function (xhr, err) {
            console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
            console.log(xhr.responseText);
        }
    });
    $.ajax({
        type: 'GET',
        data: UrlToPass,
        url: 'equip_infos.php',
        dataType: 'json',
        success: function(data) {
            $('#result').html("");
            $('#new').html("");
            EntryName.html("");
            EquipmentID.attr('value', "");

            Ajax = data;
            console.log(data);
            EntryName.html(data.name);
            EquipID = data.equipmentID;
            EquipmentID.attr('value', EquipID);

            if (EquipID == 0) {
                ID = -1;
                NewID = 0;
                $('#equipnew').html('<button type="button" id="add" class="btn btn-primary">New Equipment</button>');
            }

            if (EquipID !== "0" || EquipID !== null) {
                ID = data.id.length;

                var i;
                for (i = 0; i < data.id.length; i++) {
                    ID = i;
                    $('#result').append('<div class="col-md-12"><br />');

                    ModelView(data.id[i].mainhand.displayid, data.id[i].offhand.displayid);
                    DisplayRow(Entry, EquipID, ID, data.id[i], i);

                    $('#result').append('</div>');

                } // endfor

                NewID = data.id.length;
                $('#new').html('<button type="button" id="add" class="btn btn-primary">New ID</button>');
                $('#equipnew').html('');

            } //end check
        } //end of function(data)
    }); //end of ajax

    if (Entry === '') {
        EntryName.html("Entry");
        EquipmentID.html("");
    }
});

$('#equipnew').click(function() {
    $.ajax({
        type: 'GET',
        data: 'entry=' + Entry + '&newequipmentid=true',
        url: 'new.php',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            EquipmentID.attr('value', data.equipmentID);

            ModelView(0, 0);
            DisplayRow(Entry, EquipID, 0, data.id, 0);

            $('#equipnew').html("");
            NewID = 1;
            $('#new').html('<button type="button" id="add" class="btn btn-primary">New ID</button>');
        }
    });


});

$('#new').click(function() {
    $('#result').append(
        '<div class="col-md-12"><br />' +
        '   <div class="col-md-4">' +
        '       <object width="100%" height="300px" type="application/x-shockwave-flash" data="http://wow.zamimg.com/modelviewer/ZAMviewerfp11.swf" id="paperdoll-model-paperdoll-0-equipment-set" style="background: #fff">' +
        '             <param name="quality" value="high">' +
        '             <param name="allowsscriptaccess" value="always">' +
        '             <param name="allowfullscreen" value="true">' +
        '             <param name="menu" value="false">' +
        '             <param name="flashvars" value="model=orcfemale&amp;modelType=16&amp;cls=11&amp;equipList=17,0,17,0&amp;sk=7&amp;ha=0&amp;hc=5&amp;fa=4&amp;fh=1&amp;fc=1&amp;mode=3&amp;contentPath=//wow.zamimg.com/modelviewer/&amp;container=paperdoll-model-paperdoll-0-equipment-set&amp;hd=false&amp;">' +
        '             <param name="bgcolor" value="fff"> ' +
        '             <param name="wmode" value="direct">' +
        '        </object>' +
        '   </div>' +
        '   <div class="col-md-8">' +
        '   <h4>ID : ' + NewID + '</h4>' +
        '   <div class="col-md-4">' +
        '       <h5>Main Hand</h5>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">DisplayID</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'mh\', \'display\', this.value)" value="">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Skill</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'mh\', \'skill\', this.value)" value="">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Slot</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'mh\', \'slot\', this.value)" value="">' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-md-4">' +
        '       <h5>Off Hand</h5>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">DisplayID</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'oh\', \'display\', this.value)" value="">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Skill</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'oh\', \'skill\', this.value)" value="">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Slot</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'oh\', \'slot\', this.value)" value="">' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-md-4">' +
        '       <h5>Ranged</h5>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">DisplayID</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'ranged\', \'display\', this.value)" value="">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Skill</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'ranged\', \'skill\', this.value)" value="">' +
        '       </div>' +
        '       <div class="input-group col-md-12">' +
        '           <span class="input-group-addon">Slot</span>' +
        '           <input type="text" class="form-control" onchange="update(' + Entry + ', ' + EquipID + ', ' + NewID + ', \'ranged\', \'slot\', this.value)" value="">' +
        '       </div>' +
        '   </div>' +
        '   </div>' +
        '</div>'
    );
    NewID++;
});

function update(entry, equipmentid, id, weapon, info, value) {
    if (!(weapon == 'mh' || weapon == 'oh' || weapon == 'ranged') || !(info == 'display' || info == 'skill' || info == 'slot')) {
        return false;
    }

    $.ajax({
        type: 'GET',
        data: 'entry=' + entry + '&equipmentid=' + equipmentid + '&id=' + id + '&weapon=' + weapon + '&info=' + info + '&value=' + value,
        url: 'insert.php'
    });
}

function generateSQL(Equip) {
    var SQL = {};
    var Length = Object.keys(Equip).length;

    SQL.update = 'UPDATE creature_template SET equipment_id = ' + Equip.equipmentID + ' WHERE entry = {{ entry }};';
    SQL.delete = 'DELETE FROM creature_equip_template WHERE entry = ' + Equip.equipmentID + ';';
    SQL.insert = 'INSERT IGNORE INTO world.smart_scripts (entryorguid, source_type, id, link, event_type, event_phase_mask, event_chance, event_flags, event_param1, event_param2, event_param3, event_param4, action_type, action_param1, action_param2, action_param3, action_param4, action_param5, action_param6, target_type, target_flags, target_param1, target_param2, target_param3, target_x, target_y, target_z, target_o, comment, patch_min, patch_max) VALUES';
    for (i = 0; i < Length; i++) {
        SQL.insert += '(' + Entry + ',' + Type + ',' + Lines[i].id + ',' + Lines[i].link + ',' + Lines[i].event_type + ',' + Lines[i].event_phase_mask + ',' + Lines[i].event_chance + ',' + Lines[i].event_flags + ',' + Lines[i].event_param1 + ',' + Lines[i].event_param2 + ',' + Lines[i].event_param3 + ',' + Lines[i].event_param4 + ',' + Lines[i].action_type + ',' + Lines[i].action_param1 + ',' + Lines[i].action_param2 + ',' + Lines[i].action_param3 + ',' + Lines[i].action_param4 + ',' + Lines[i].action_param5 + ',' + Lines[i].action_param6 + ',' + Lines[i].target_type + ',' + Lines[i].target_flags + ',' + Lines[i].target_param1 + ',' + Lines[i].target_param2 + ',' + Lines[i].target_param3 + ',' + Lines[i].target_x + ',' + Lines[i].target_y + ',' + Lines[i].target_z + ',' + Lines[i].target_o + ',\"' + Lines[i].comment + '\",' + Lines[i].patch_min + ',' + Lines[i].patch_max + '),';
    }
    var Pos = SQL.insert.lastIndexOf(',');
    SQL.insert = SQL.insert.substring(0, Pos) + ';' + SQL.insert.substring(Pos + 1);
    return JSON.stringify(SQL);
}