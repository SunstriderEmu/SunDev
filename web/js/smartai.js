(function($)
{
    $.fn.smartai=function(informations) {

        var User = informations.User;
        var Entry = informations.Entry;
        var Type = informations.Type;
        var Name = informations.Name;
        var Lines = informations.Lines;
        var Events = informations.Events;
        var Actions = informations.Actions;
        var Targets = informations.Targets;

        if (jQuery.isEmptyObject(Lines)) {
            var MaxID = -1;
        } else {
            MaxID = Object.keys(Lines).length - 1;
        }

        var EventType = $('#event_type');
        var ActionType = $('#action_type');
        var TargetType = $('#target_type');

        var EventParam1 = $('#event_param1');
        var EventParam2 = $('#event_param2');
        var EventParam3 = $('#event_param3');
        var EventParam4 = $('#event_param4');
        var EventParam1DIV = EventParam1.next('div');
        var EventParam2DIV = EventParam2.next('div');
        var EventParam3DIV = EventParam3.next('div');
        var EventParam4DIV = EventParam4.next('div');

        var ActionParam1 = $('#action_param1');
        var ActionParam2 = $('#action_param2');
        var ActionParam3 = $('#action_param3');
        var ActionParam4 = $('#action_param4');
        var ActionParam5 = $('#action_param5');
        var ActionParam6 = $('#action_param6');
        var ActionParam1DIV = ActionParam1.next('div');
        var ActionParam2DIV = ActionParam2.next('div');
        var ActionParam3DIV = ActionParam3.next('div');
        var ActionParam4DIV = ActionParam4.next('div');
        var ActionParam5DIV = ActionParam5.next('div');
        var ActionParam6DIV = ActionParam6.next('div');

        var TargetParam1 = $('#target_param1');
        var TargetParam2 = $('#target_param2');
        var TargetParam3 = $('#target_param3');
        var TargetParam1DIV = TargetParam1.next('div');
        var TargetParam2DIV = TargetParam2.next('div');
        var TargetParam3DIV = TargetParam3.next('div');

        var SelectTargetFlags = '#target_flags_value';
        var i;

        var PHASE_1 = "#8CDAFE";
        var PHASE_2 = "#FA91AC";
        var PHASE_3 = "#96E5B8";
        var PHASE_4 = "#F89289";
        var PHASE_5 = "#DFAAF5";
        var PHASE_6 = "#FBE48B";
        var PHASE_7 = "#F8BC9A";
        var PHASE_8 = "#DEE1E3";
        var PHASE_9 = "#89ADF8";

        RefreshTable();
        function RefreshTable() {
            $('table > tbody > tr > td:first-child').click(function () {
                var id = $(this).text();
                displayLine(id, this);
            });
            $('table > tbody > tr > td:nth-child(2)').click(function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                displayLine(id, this);
            });
            $('table > tbody > tr > td:nth-child(3)').click(function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                displayLine(id, this);
            });
            $('table > tbody > tr > td:nth-child(4)').click(function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                displayLine(id, this);
            });
            $('table > tbody > tr > td:nth-child(5)').click(function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                displayLine(id, this);
            });
            $('table > tbody > tr > td:nth-child(6)').click(function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                displayLine(id, this);
            });
            $('table > tbody > tr > td:nth-child(7)').off().on('click', 'span.glyphicon-plus', function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                duplicateLine(id);
            });
            $('table > tbody > tr > td:nth-child(7) > span.glyphicon-remove').click(function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                deleteLine(id);
            });
        }

        // Set Phase Color at browsing
        $('table > tbody > tr').each(function () {
            var id = $(this).find('td:first-child').text();

            var Color = [];
            if (Lines[id].event_phase_mask != "0") {
                var Binary = "0x" + Hex(Lines[id].event_phase_mask);
                if (0x1 & Binary) {
                    Color.push(PHASE_1);
                }
                if (0x2 & Binary) {
                    Color.push(PHASE_2);
                }
                if (0x4 & Binary) {
                    Color.push(PHASE_3);
                }
                if (0x8 & Binary) {
                    Color.push(PHASE_4);
                }
                if (0x10 & Binary) {
                    Color.push(PHASE_5);
                }
                if (0x20 & Binary) {
                    Color.push(PHASE_6);
                }
                if (0x40 & Binary) {
                    Color.push(PHASE_7);
                }
                if (0x80 & Binary) {
                    Color.push(PHASE_8);
                }
                if (0x100 & Binary) {
                    Color.push(PHASE_9);
                }
            }
            $(this).css('background-color', generatePhaseColor(Color));
        });

        $('#event_phase_mask_value').chosen().change(function () {
            var Value = $(this).val() || [];
            var ID = $('table > tbody > tr.active > td:first-child').text();
            if (ID == "") {
                alert('Please choose a line.');
            }
            var total = 0;
            for (var i = 0; i < Value.length; i++) {
                total += Value[i] << 0;
            }
            Lines[ID].event_phase_mask = total;
            $(this).trigger('chosen:updated');
        });
        $('#event_flags_value').chosen().change(function () {
            var Value = $(this).val() || [];
            var ID = $('table > tbody > tr.active > td:first-child').text();
            if (ID == "") {
                alert('Please choose a line.');
            }
            var total = 0;
            for (var i = 0; i < Value.length; i++) {
                total += Value[i] << 0;
            }
            Lines[ID].event_flags = total;
            $(this).trigger('chosen:updated');
        });
        $('#target_flags_value').chosen().change(function () {
            var Value = $(this).val() || [];
            var ID = $('table > tbody > tr.active > td:first-child').text();
            if (ID == "") {
                alert('Please choose a line.');
            }
            var total = 0;
            for (var i = 0; i < Value.length; i++) {
                total += Value[i] << 0;
            }
            Lines[ID].target_flags = total;
            $(this).trigger('chosen:updated');
        });

        $('#generate_comments').click(function () {
            generateComments(Lines);
        });
        function generateComments(Lines) {
            for (var i in Lines) {
                var TR = $('td:first-child').filter(function() { return $.text([this]) == i; }).closest('tr');
                var ID = $('td:first-child').filter(function() { return $.text([this]) == i; }).closest('tr').find('> td:first-child').text();
                var Comment = Name + ' - ' + generateEventComment(ID) + ' - ' + generateActionComment(ID) + " " + generateFlagsComment(ID) + generatePhaseComment(ID);
                TR.find('td:nth-child(6)').html(Comment);
                Lines[ID].comment = $(this).text();
            }
        }

        $('#apply').click(function () {
            generateComments(Lines);
            $.ajax({
                type: "POST",
                url: '/smartai/apply',
                data: 'sql=' + generateSQL(Lines),
                success: function (data) {
                    console.log(Date() + " - " + data);
                },
                error: function (xhr, err) {
                    console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                    console.log(xhr.responseText);
                }
            });
        });

        $('#validate').click(function () {
            generateComments(Lines);
            var Review = { "entryorguid": Entry, "source_type": Type, "user": User };
            $.ajax({
                type: "POST",
                url: '/smartai/review/validate',
                data: 'sql=' + generateSQL(Lines) + '&review=' + JSON.stringify(Review),
                success: function (data) {
                    console.log(Date() + " - " + data);
                },
                error: function (xhr, err) {
                    console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                    console.log(xhr.responseText);
                }
            });
        });
        $('#review').click(function () {
            var Review = { "entryorguid": Entry, "source_type": Type, "user": User, };
            $.ajax({
                type: "POST",
                url: '/smartai/review',
                data: 'review=' + JSON.stringify(Review),
                success: function (data) {
                    console.log(Date() + " - " + data);
                },
                error: function (xhr, err) {
                    console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                    console.log(xhr.responseText);
                }
            });
        });
        $('#generate_sql').click(function () {
            generateComments(Lines);
            var SQL = jQuery.parseJSON(generateSQL(Lines));
            console.log('-- ' + Name + ' SAI\n' + SQL.update + '\n' + SQL.delete + '\n' + formattingSQL(SQL.insert));
        });
        function generateSQL(Lines) {
            var SQL = {};
            var Length = Object.keys(Lines).length;

            SQL.update = 'UPDATE world.creature_template SET AIName="SmartAI", ScriptName="" WHERE entry = ' + Entry + ';';
            SQL.delete = 'DELETE FROM world.smart_scripts WHERE entryorguid = ' + Entry + ' AND source_type = ' + Type + ';';
            SQL.insert = 'INSERT IGNORE INTO world.smart_scripts (entryorguid, source_type, id, link, event_type, event_phase_mask, event_chance, event_flags, event_param1, event_param2, event_param3, event_param4, action_type, action_param1, action_param2, action_param3, action_param4, action_param5, action_param6, target_type, target_flags, target_param1, target_param2, target_param3, target_x, target_y, target_z, target_o, comment) VALUES';
            for (i = 0; i < Length; i++) {
                SQL.insert += '(' + Entry + ',' + Type + ',' + Lines[i].id + ',' + Lines[i].link + ',' + Lines[i].event_type + ',' + Lines[i].event_phase_mask + ',' + Lines[i].event_chance + ',' + Lines[i].event_flags + ',' + Lines[i].event_param1 + ',' + Lines[i].event_param2 + ',' + Lines[i].event_param3 + ',' + Lines[i].event_param4 + ',' + Lines[i].action_type + ',' + Lines[i].action_param1 + ',' + Lines[i].action_param2 + ',' + Lines[i].action_param3 + ',' + Lines[i].action_param4 + ',' + Lines[i].action_param5 + ',' + Lines[i].action_param6 + ',' + Lines[i].target_type + ',' + Lines[i].target_flags + ',' + Lines[i].target_param1 + ',' + Lines[i].target_param2 + ',' + Lines[i].target_param3 + ',' + Lines[i].target_x + ',' + Lines[i].target_y + ',' + Lines[i].target_z + ',' + Lines[i].target_o + ',\"' + Lines[i].comment + '\"),';
            }
            var Pos = SQL.insert.lastIndexOf(',');
            SQL.insert = SQL.insert.substring(0, Pos) + ';' + SQL.insert.substring(Pos + 1);
            return JSON.stringify(SQL);
        }

        // Replace the last comma with " and "
        function replaceComma(string) {
            if (string.indexOf(",") === -1) {
                return string;
            }
            var pos = string.lastIndexOf(',');
            return string.substring(0, pos) + ' and ' + string.substring(pos + 1);
        }
        // Replace the last comma with " and "
        function formattingSQL(string) {
            if (string.indexOf("),") === -1 || string.indexOf("VALUES") === -1) {
                return string;
            }
            var pos = string.lastIndexOf('),(');
            string = string.substring(0, pos + 2) + '\n' + string.substring(pos + 2);
            pos = string.lastIndexOf('S(');
            return string.substring(0, pos + 1) + '\n' + string.substring(pos + 1);
        }

        function generateFlagsComment(id) {
            if (Lines[id].event_flags == "0") {
                return "";
            }
            var Binary = "0x" + Hex(Lines[id].event_flags);
            var Return = "(";
            if (0x1 & Binary) {
                Return += "No Repeat";
            }
            if (0x2 & Binary) {
                if (Return != "(") {
                    Return += ", Normal Dungeon";
                } else {
                    Return += "Normal Dungeon";
                }
            }
            if (0x4 & Binary) {
                if (Return != "(") {
                    Return += ", Heroic Dungeon";
                } else {
                    Return += "Heroic Dungeon";
                }
            }
            if (0x8 & Binary) {
                if (Return != "(") {
                    Return += ", Normal Raid";
                } else {
                    Return += "Normal Raid";
                }
            }
            if (0x10 & Binary) {
                if (Return != "(") {
                    Return += ", Heroic Raid";
                } else {
                    Return += "Heroic Raid";
                }
            }
            if (0x20 & Binary) {
                if (Return != "(") {
                    Return += ", Debug";
                } else {
                    Return += "Debug";
                }
            }
            Return += ")";
            if (Return == "()") {
                return "";
            }
            return replaceComma(Return);
        }
        function generatePhaseComment(id) {
            var TR = $('table > tbody > tr:has(td:first-child:contains("' + id + '"))');
            if (Lines[id].event_phase_mask == "0") {
                TR.css('background-color', 'none');
                return "";
            }
            var Binary = "0x" + Hex(Lines[id].event_phase_mask);
            var Return = "(";
            var Color = [];
            if (0x1 & Binary) {
                Color.push(PHASE_1);
                Return += "Phase 1";
            }
            if (0x2 & Binary) {
                Color.push(PHASE_2);
                if (Return != "(") {
                    Return += ", Phase 2";
                } else {
                    Return += "Phase 2";
                }
            }
            if (0x4 & Binary) {
                Color.push(PHASE_3);
                if (Return != "(") {
                    Return += ", Phase 3";
                } else {
                    Return += "Phase 3";
                }
            }
            if (0x8 & Binary) {
                Color.push(PHASE_4);
                if (Return != "(") {
                    Return += ", Phase 4";
                } else {
                    Return += "Phase 4";
                }
            }
            if (0x10 & Binary) {
                Color.push(PHASE_5);
                if (Return != "(") {
                    Return += ", Phase 5";
                } else {
                    Return += "Phase 5";
                }
            }
            if (0x20 & Binary) {
                Color.push(PHASE_6);
                if (Return != "(") {
                    Return += ", Phase 6";
                } else {
                    Return += "Phase 6";
                }
            }
            if (0x40 & Binary) {
                Color.push(PHASE_7);
                if (Return != "(") {
                    Return += ", Phase 7";
                } else {
                    Return += "Phase 7";
                }
            }
            if (0x80 & Binary) {
                Color.push(PHASE_8);
                if (Return != "(") {
                    Return += ", Phase 8";
                } else {
                    Return += "Phase 8";
                }
            }
            if (0x100 & Binary) {
                Color.push(PHASE_9);
                if (Return != "(") {
                    Return += ", Phase 9";
                } else {
                    Return += "Phase 9";
                }
            }
            Return += ")";
            TR.css('background-color', generatePhaseColor(Color));
            return replaceComma(Return);
        }
        function generatePhaseColor(Color) {
            if (Color.length > 1) {
                var PhaseColor = Color[0];
                for (i = 1; i < Color.length; i++) {
                    PhaseColor = $.xcolor.average(PhaseColor, Color[i]).getHex();
                }
                return PhaseColor;
            } else {
                return Color[0];
            }
        }
        function generateEventComment(id) {
            switch (Lines[id].event_type) {
                case "0":
                    return "In Combat";
                    break;
                case "1":
                    return "Out of Combat";
                    break;
                case "2":
                    return "Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2 + "% HP";
                    break;
                case "3":
                    return "Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2 + "% MP";
                    break;
                case "4":
                    return "On Aggro";
                    break;
                case "5":
                    if (Lines[id].event_param3 == "0" && Lines[id].event_param4 > "0") {
                        return "On '<a href='http://wowhead.com/npc=" + Lines[id].event_param1 + "'>" + getCreatureName(Lines[id].event_param4) + "</a>' Killed";
                    } else if (Lines[id].event_param3 == "1") {
                        return "On Player Killed";
                    } else {
                        return "On Killed Unit";
                    }
                    break;
                case "6":
                    return "On Death";
                    break;
                case "7":
                    return "On Evade";
                    break;
                case "8":
                    return "On Spellhit '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    break;
                case "9":
                    return "Within " + Lines[id].event_param1 + "-" + Lines[id].event_param2 + " Range";
                    break;
                case "10":
                    return "Within " + Lines[id].event_param1 + "-" + Lines[id].event_param2 + " Range OOC LoS";
                    break;
                case "11":
                    return "On Respawn";
                    break;
                case "12":
                    return "Target Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2 + "% HP";
                    break;
                case "13":
                    return "On Victim Casting '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    break;
                case "14":
                    return "On Friendly at '" + Lines[id].event_param1 + "' HP";
                    break;
                case "15":
                    return "On Friendly CCed";
                    break;
                case "16":
                    return "On Friendly Missing Buff '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    break;
                case "17":
                    return "On Summon '<a href='http://wowhead.com/npc=" + Lines[id].event_param1 + "'>" + getCreatureName(Lines[id].event_param1) + "</a>'";
                    break;
                case "18":
                    return "Target Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2 + "% MP";
                    break;
                case "19":
                    return "On Quest '<a href='http://wowhead.com/quest=" + Lines[id].event_param1 + "'>" + getQuestName(Lines[id].event_param1) + "</a>' Accepted";
                    break;
                case "20":
                    return "On Quest '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getQuestName(Lines[id].event_param1) + "</a>' Rewarded";
                    break;
                case "21":
                    return "On Reached Home";
                    break;
                case "22":
                    return "On Received Emote " + Lines[id].event_param1;
                    break;
                case "23":
                    if (Lines[id].event_param2 > "0") {
                        return "On Has Aura '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    } else if (Lines[id].event_param2 == "0") {
                        return "On Missing Aura '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    } else {
                        alert("Error:\nLine " + id + ": 'Stacks' is negative.");
                        return "Error: Param2 is negative";
                    }
                    break;
                case "24":
                    if (Lines[id].event_param2 > "0") {
                        return "On Target Buffed With '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    } else if (Lines[id].event_param2 == "0") {
                        return "On Target Missing Aura '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    } else {
                        alert("Error:\nLine " + id + ": 'Stacks' is negative.");
                        return "Error: Param2 is negative";
                    }
                    break;
                case "25":
                    return "On Reset";
                    break;
                case "26":
                    return "In Combat LoS";
                    break;
                case "27":
                    return "On Passenger Boarded";
                    break;
                case "28":
                    return "On Passenger Removed";
                    break;
                case "29":
                    return "On Charmed";
                    break;
                case "30":
                    return "On Target Charmed";
                    break;
                case "31":
                    return "On Target Spellhit '<a href='http://wowhead.com/spell=" + Lines[id].event_param1 + "'>" + getSpellName(Lines[id].event_param1) + "</a>'";
                    break;
                case "32":
                    return "On Damaged Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2;
                    break;
                case "33":
                    return "On Damaged Target Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2;
                    break;
                case "34":
                    return "On Reached Point " + Lines[id].event_param2;
                    break;
                case "35":
                    return "On Summon '<a href='http://wowhead.com/npc=" + Lines[id].event_param1 + "'>" + getCreatureName(Lines[id].event_param1) + "</a>' Despawned";
                    break;
                case "36":
                    return "On Corpse Removed";
                    break;
                case "37":
                    return "On AI Initialize";
                    break;
                case "38":
                    return "On Data Set " + Lines[id].event_param1 + " " + Lines[id].event_param2;
                    break;
                case "39":
                    return "On Waypoint " + Lines[id].event_param1 + " Started";
                    break;
                case "40":
                    return "On Waypoint " + Lines[id].event_param1 + " Reached";
                    break;
                case "41":
                    return "On Transport Player Added";
                    break;
                case "42":
                    return "On Transport Creature Added";
                    break;
                case "43":
                    return "On Transport Remove Player";
                    break;
                case "44":
                    return "On Transport Relocate";
                    break;
                case "45":
                    return "On Instance Player Enter";
                    break;
                case "46":
                    return "On Trigger";
                    break;
                case "47":
                    return "On Quest Accepted";
                    break;
                case "48":
                    return "On Quest Objective Completed";
                    break;
                case "49":
                    return "On Quest Completed";
                    break;
                case "50":
                    return "On Quest Rewarded";
                    break;
                case "51":
                    return "On Quest Failed";
                    break;
                case "52":
                    return "On Text " + Lines[id].event_param1 + " Over";
                    break;
                case "53":
                    return "On Received Heal Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2;
                    break;
                case "54":
                    return "On Just Summoned";
                    break;
                case "55":
                    return "On Waypoint " + Lines[id].event_param1 + " Paused";
                    break;
                case "56":
                    return "On Waypoint " + Lines[id].event_param1 + " Resumed";
                    break;
                case "57":
                    return "On Waypoint " + Lines[id].event_param1 + " Stopped";
                    break;
                case "58":
                    return "On Waypoint " + Lines[id].event_param1 + " Ended";
                    break;
                case "59":
                    return "On Timed Event " + Lines[id].event_param1 + " Triggered";
                    break;
                case "60":
                    return "On Update";
                    break;
                case "61":
                    if (Lines[id].link == Lines[id].id) {
                        alert('Error\nLine ' + Lines[id].id + ': if you link the line to itself, the line will never be triggered!');
                        return "ERROR";
                    }
                    // Looking for the id that has the line id in its Link column
                    var Event = $('td:nth-child(2)').filter(function() { return $.text([this]) == id; }).closest('tr').find('td:first-child').text();
                    if (Event == "") {
                        return "MISSING LINK";
                    }
                    return generateEventComment(Event);
                    break;
                case "62":
                    return "On Gossip Option " + Lines[id].event_param2 + " Selected";
                    break;
                case "63":
                    return "On Just Created";
                    break;
                case "64":
                    return "On Gossip Hello";
                    break;
                case "65":
                    return "On Follow Complete";
                    break;
                case "66":
                    return "On Dummy Effect";
                    break;
                case "67":
                    return "On Behind Target";
                    break;
                case "68":
                    return "On Game Event " + Lines[id].event_param1 + " Started";
                    break;
                case "69":
                    return "On Game Event " + Lines[id].event_param1 + " Ended";
                    break;
                case "70":
                    return "On GO State Changed";
                    break;
                case "71":
                    return "On Event " + Lines[id].event_param1 + " Inform";
                    break;
                case "72":
                    return "On Action " + Lines[id].event_param1 + " Done";
                    break;
                case "73":
                    return "On Spellclick";
                    break;
                case "74":
                    return "On Friendly Between " + Lines[id].event_param1 + "-" + Lines[id].event_param2 + "% HP";
                    break;
                case "75":
                    return "On Distance To Creature";
                    break;
                case "76":
                    return "On Distance To GO";
                    break;
                case "77":
                    return "On Counter Set " + Lines[id].event_param1;
                    break;
                case "100":
                    return "On Friendly Killed In " + Lines[id].event_param1 + " Range";
                    break;
                case "101":
                    if (Lines[id].event_param2 == "0") {
                        return "On Victim Not In LoS";
                    } else if (Lines[id].event_param2 == "1") {
                        return "On Victim In LoS";
                    } else {
                        alert("Error:\nLine " + id + ": 'Reverts' must be either 0 or 1.");
                        return "Error: Param2 is not 0 or 1.";
                    }
                    break;
                case "102":
                    return "On Victim Died";
                    break;
                case "103":
                    return "On Enter Phase " + Lines[id].event_param1;
                    break;
            }
        }
        function generateActionComment(id) {
            switch (Lines[id].action_type) {
                case "0":
                    return "No Action Type";
                    break;
                case "1":
                    return "Say Line " + Lines[id].action_param1;
                    break;
                case "2":
                    return "Set Faction " + Lines[id].action_param1;
                    break;
                case "3":
                    return "Morph To '" + Lines[id].action_param1 + "'";
                    break;
                case "4":
                    return "Play Sound " + Lines[id].action_param1;
                    break;
                case "5":
                    return "Play Emote " + Lines[id].action_param1;
                    break;
                case "6":
                    return "Fail Quest '<a href='http://wowhead.com/quest=" + Lines[id].action_param1 + "'>" + getQuestName(Lines[id].action_param1) + "</a>'";
                    break;
                case "7":
                    return "Add Quest 'http://wowhead.com/quest=" + getQuestName(Lines[id].action_param1) + "</a>'";
                    break;
                case "8":
                    switch (Lines[id].action_param2) {
                        case "0":
                            return "Set React State Passive";
                            break;
                        case "1":
                            return "Set React State Defensive";
                            break;
                        case "2":
                            return "Set React State Aggressive";
                            break;
                        default:
                            return;
                    }
                    break;
                case "9":
                    return "Activate GO";
                    break;
                case "10":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 != "0" && Lines[id].action_param6 != "0") {
                        return "Play Random Emote (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "," + Lines[id].action_param3 + "," + Lines[id].action_param4 + "," + Lines[id].action_param5 + "&" + Lines[id].action_param6 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 != "0" && Lines[id].action_param6 == "0") {
                        return "Play Random Emote (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "," + Lines[id].action_param3 + "," + Lines[id].action_param4 + "&" + Lines[id].action_param5 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Play Random Emote (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "," + Lines[id].action_param3 + "&" + Lines[id].action_param4 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Play Random Emote (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "&" + Lines[id].action_param3 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Play Random Emote (" + Lines[id].action_param1 + "&" + Lines[id].action_param2 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        alert("Error:\nLine " + id + ": 'Emote id 2' should not be 0.");
                        return "Error";
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 == "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        alert("Error:\nLine " + id + ": 'Emote id 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "11":
                    return "Cast '<a href='http://wowhead.com/spell=" + Lines[id].action_param1 + "'>" + getSpellName(Lines[id].action_param1) + "</a>'";
                    break;
                case "12":
                    return "Summon '<a href='http://wowhead.com/npc=" + Lines[id].action_param1 + "'>" + getCreatureName(Lines[id].action_param1) + "</a>'";
                    break;
                case "13":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0") {
                        return "Increase Target Threat By " + Lines[id].action_param1 + "%";
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 != "0") {
                        return "Decrease Target Threat By " + Lines[id].action_param1 + "%";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "14":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0") {
                        return "Increase All Threat By " + Lines[id].action_param1 + "%";
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 != "0") {
                        return "Decrease All Threat By " + Lines[id].action_param1 + "%";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "15":
                    return "Quest Credit ''<a href='http://wowhead.com/quest" + Lines[id].action_param1 + "'>" + getQuestName(Lines[id].action_param1) + "</a>'";
                    break;
                case "16":
                    return "Unused Action Type 16";
                    break;
                case "17":
                    return "Set Emote State " + Lines[id].action_param1;
                    break;
                case "18":
                case "19":
                    var Comment = "Set Unit Flag ";
                    var Binary = "0x" + Hex(Lines[id].action_param1);
                    if (0x1 & Binary) {
                        Comment += "Server Controlled";
                    }
                    if (0x2 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Non Attackable";
                        } else {
                            Comment += "Non Attackable"
                        }
                    }
                    if (0x4 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Disable Move";
                        } else {
                            Comment += "Disable Move"
                        }
                    }
                    if (0x8 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", PvP Attackable";
                        } else {
                            Comment += "PvP Attackable"
                        }
                    }
                    if (0x10 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Rename";
                        } else {
                            Comment += "Rename"
                        }
                    }
                    if (0x20 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Preparation";
                        } else {
                            Comment += "Preparation"
                        }
                    }
                    if (0x40 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", UNK6";
                        } else {
                            Comment += "UNK6"
                        }
                    }
                    if (0x80 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Not Attackable 1";
                        } else {
                            Comment += "Not Attackable 1"
                        }
                    }
                    if (0x100 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Immune to PC";
                        } else {
                            Comment += "Immune to PC"
                        }
                    }
                    if (0x200 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Immune to NPC";
                        } else {
                            Comment += "Immune to NPC"
                        }
                    }
                    if (0x400 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Looting";
                        } else {
                            Comment += "Looting"
                        }
                    }
                    if (0x800 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Pet In Combat";
                        } else {
                            Comment += "Pet In Combat"
                        }
                    }
                    if (0x1000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", PvP";
                        } else {
                            Comment += "PvP"
                        }
                    }
                    if (0x2000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Silenced";
                        } else {
                            Comment += "Silenced"
                        }
                    }
                    if (0x4000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", UNK 14";
                        } else {
                            Comment += "UNK 14"
                        }
                    }
                    if (0x8000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", UNK 15";
                        } else {
                            Comment += "UNK 15"
                        }
                    }
                    if (0x10000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Not PL Spell Target";
                        } else {
                            Comment += "Not PL Spell Target"
                        }
                    }
                    if (0x20000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Pacified";
                        } else {
                            Comment += "Pacified"
                        }
                    }
                    if (0x40000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Stunned";
                        } else {
                            Comment += "Stunned"
                        }
                    }
                    if (0x80000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", In Combat";
                        } else {
                            Comment += "In Combat"
                        }
                    }
                    if (0x100000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Taxi Flight";
                        } else {
                            Comment += "Taxi Flight"
                        }
                    }
                    if (0x200000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Disarmed";
                        } else {
                            Comment += "Disarmed"
                        }
                    }
                    if (0x400000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Confused";
                        } else {
                            Comment += "Confused"
                        }
                    }
                    if (0x800000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Fleeing";
                        } else {
                            Comment += "Fleeing"
                        }
                    }
                    if (0x1000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Player Controlled";
                        } else {
                            Comment += "Player Controlled"
                        }
                    }
                    if (0x2000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Not Selectable";
                        } else {
                            Comment += "Not Selectable"
                        }
                    }
                    if (0x4000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Skinnable";
                        } else {
                            Comment += "Skinnable"
                        }
                    }
                    if (0x8000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Mount";
                        } else {
                            Comment += "Mount"
                        }
                    }
                    if (0x10000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", UNK 28";
                        } else {
                            Comment += "UNK 28"
                        }
                    }
                    if (0x20000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", UNK 29";
                        } else {
                            Comment += "UNK 29"
                        }
                    }
                    if (0x40000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", Sheathe";
                        } else {
                            Comment += "Sheathe"
                        }
                    }
                    if (0x80000000 & Binary) {
                        if (Comment != "Set Unit Flag ") {
                            Comment += ", UNK 31";
                        } else {
                            Comment += "UNK 31"
                        }
                    }
                    return replaceComma(Comment);
                    break;
                case "20":
                    if (Lines[id].action_param1 == "0") {
                        return "Stop Attacking";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Start Attacking";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "21":
                    if (Lines[id].action_param1 == "0") {
                        return "Disable Combat Movement";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Enable Combat Movement";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "22":
                    return "Set Event Phase " + Lines[id].action_param1;
                    break;
                case "23":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0") {
                        return "Increase Phase By " + Lines[id].action_param1;
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 != "0") {
                        return "Decrease Phase By " + Lines[id].action_param1;
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "24":
                    return "Evade";
                    break;
                case "25":
                    return "Flee For Assist";
                    break;
                case "26":
                    return "Quest Credit '<a href='http://wowhead.com/quest=" + Lines[id].action_param1 + "'>" + getQuestName(Lines[id].action_param1) + "</a>'";
                    break;
                case "27":
                    return "Quest Credit '<a href='http://wowhead.com/quest=" + Lines[id].action_param1 + "'>" + getQuestName(Lines[id].action_param1) + "</a>'";
                    break;
                case "28":
                    return "Remove Aura '<a href='http://wowhead.com/spell=" + Lines[id].action_param1 + "'>" + getSpellName(Lines[id].action_param1) + "</a>'";
                    break;
                case "29":
                    return "Follow Target";
                    break;
                case "30":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 != "0" && Lines[id].action_param6 != "0") {
                        return "Set Random Phase (" + getPower(Lines[id].action_param1) + ", " + getPower(Lines[id].action_param2) + ", " + getPower(Lines[id].action_param3) + ", " + getPower(Lines[id].action_param4) + ", " + getPower(Lines[id].action_param5) + " and " + getPower(Lines[id].action_param6) + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 != "0" && Lines[id].action_param6 == "0") {
                        return "Set Random Phase (" + getPower(Lines[id].action_param1) + ", " + getPower(Lines[id].action_param2) + ", " + getPower(Lines[id].action_param3) + ", " + getPower(Lines[id].action_param4) + " and " + getPower(Lines[id].action_param5) + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Set Random Phase (" + getPower(Lines[id].action_param1) + ", " + getPower(Lines[id].action_param2) + ", " + getPower(Lines[id].action_param3) + " and " + getPower(Lines[id].action_param4) + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Set Random Phase (" + getPower(Lines[id].action_param1) + ", " + getPower(Lines[id].action_param2) + " and " + getPower(Lines[id].action_param3) + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Set Random Phase (" + getPower(Lines[id].action_param1) + " and " + getPower(Lines[id].action_param2) + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 2' should not be 0.");
                        return "Error";
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 == "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "31":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0" && Lines[id].action_param1 != Lines[id].action_param2 && Lines[id].action_param2 > Lines[id].action_param1) {
                        return "Set Phase Random Between " + Lines[id].action_param1 + "-" + Lines[id].action_param2;
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "32":
                    return "Reset GO";
                    break;
                case "33":
                    return "Quest Credit '<a href='http://wowhead.com/quest=" + Lines[id].action_param1 + "'>" + getQuestName(Lines[id].action_param1) + "</a>'";
                    break;
                case "34":
                    return "Set Instance Data " + Lines[id].action_param1 + " to " + Lines[id].action_param2;
                    break;
                case "35":
                    return "Set Instance Data " + Lines[id].action_param1 + " to " + Lines[id].action_param2;
                    break;
                case "36":
                    return "Update Template To '<a href='http://wowhead.com/npc=" + Lines[id].action_param1 + "'>" + getCreatureName(Lines[id].action_param1) + "</a>'";
                    break;
                case "37":
                    return "Die";
                    break;
                case "38":
                    return "Set In Combat With Zone";
                    break;
                case "39":
                    return "Call For Help";
                    break;
                case "40":
                    switch (Lines[id].action_param1) {
                        case "0":
                            return "Set Sheath Unarmed";
                            break;
                        case "1":
                            return "Set Sheath Melee";
                            break;
                        case "2":
                            return "Set Sheath Ranged";
                            break;
                        default:
                            return;
                    }
                    break;
                case "41":
                    if (Lines[id].action_param1 == "0") {
                        return "Despawn Instant";
                    } else if (Lines[id].action_param1 > "0") {
                        return "Despawn In " + Lines[id].action_param1 + "ms";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "42":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0") {
                        return "Set Invincibility At " + Lines[id].action_param1 + " HP";
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 != "0") {
                        return "Set Invincibility At " + Lines[id].action_param1 + "% HP";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "43":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0") {
                        return "Mount To Creature '<a href='http://wowhead.com/npc=" + Lines[id].action_param1 + "'>" + getCreatureName(Lines[id].action_param1) + "</a>'";
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 != "0") {
                        return "Mount To Model " + Lines[id].action_param1;
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 == "0") {
                        return "Dismount";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "44":
                    return "Set Phase Mask " + Lines[id].action_param1;
                    break;
                case "45":
                    return "Set Data " + Lines[id].action_param1 + " " + Lines[id].action_param2;
                    break;
                case "46":
                    return "Move Forward " + Lines[id].action_param1 + " Yards";
                    break;
                case "47":
                    if (Lines[id].action_param1 == "0") {
                        return "Set Visibility Off";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Set Visibility On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "48":
                    if (Lines[id].action_param1 == "0") {
                        return "Set Active Off";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Set Active On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "49":
                    return "Start Attacking";
                    break;
                case "50":
                    return "Summon GO '<a href='http://wowhead.com/object=" + Lines[id].action_param1 + "'>" + getGOName(Lines[id].action_param1) + "</a>'";
                    break;
                case "51":
                    return "Kill Target";
                    break;
                case "52":
                    return "Activate Taxi Path " + Lines[id].action_param1;
                    break;
                case "53":
                    return "Start Waypoint " + Lines[id].action_param2;
                    break;
                case "54":
                    return "Pause Waypoint";
                    break;
                case "55":
                    return "Stop Waypoint";
                    break;
                case "56":
                    return "Add Item '<a href='http://wowhead.com/item=" + Lines[id].action_param1 + "'>" + getItemName(Lines[id].action_param1) + "</a>' x" + Lines[id].action_param2;
                    break;
                case "57":
                    return "Remove Item '<a href='http://wowhead.com/item=" + Lines[id].action_param1 + "'>" + getItemName(Lines[id].action_param1) + "</a>' x" + Lines[id].action_param2;
                    break;
                case "58":
                    switch (Lines[id].action_param1) {
                        case "0":
                            return "Install Basic Template";
                            break;
                        case "1":
                            return "Install Caster Template";
                            break;
                        case "2":
                            return "Install Turret Template";
                            break;
                        case "3":
                            return "Install Passive Template";
                            break;
                        case "4":
                            return "Install Caged GO Part Template";
                            break;
                        case "5":
                            return "Install Caged Creature Part Template";
                            break;
                        default:
                            return;
                    }
                    break;
                case "59":
                    if (Lines[id].action_param1 == "0") {
                        return "Set Run Off";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Set Run On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "60":
                    if (Lines[id].action_param1 == "0") {
                        return "Set Fly Off";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Set Fly On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "61":
                    if (Lines[id].action_param1 == "0") {
                        return "Set Swim Off";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Set Swim On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "62":
                    return "Teleport";
                    break;
                case "63":
                    return "Unused Action Type 63";
                    break;
                case "64":
                    return "Store Targetlist";
                    break;
                case "65":
                    return "Resume Waypoint";
                    break;
                case "66":
                    return "Set Orientation " + Lines[id].target_o;
                    break;
                case "67":
                    return "Create Timed Event";
                    break;
                case "68":
                    return "Play Movie " + Lines[id].action_param1;
                    break;
                case "69":
                    return "Move To Pos";
                    break;
                case "70":
                    return "Respawn Target";
                    break;
                case "71":
                    return "Change Equipment";
                    break;
                case "72":
                    return "Close Gossip";
                    break;
                case "73":
                    return "Trigger Timed Event " + Lines[id].action_param1;
                    break;
                case "74":
                    return "Remove Timed Event " + Lines[id].action_param1;
                    break;
                case "75":
                    return "Add Aura '<a href='http://wowhead.com/spell=" + Lines[id].action_param1 + "'>" + getSpellName(Lines[id].action_param1) + "</a>'";
                    break;
                case "76":
                    return "Override Base Object Script";
                    break;
                case "77":
                    return "Reset Base Object Script";
                    break;
                case "78":
                    return "Reset All Scripts";
                    break;
                case "79":
                    return "Set Ranged Movement";
                    break;
                case "80":
                    return "Run Script <a href='/smartai/script/" + Lines[id].action_param1 + "'>" + Lines[id].action_param1 + "</a>";
                    break;
                case "81":
                case "82":
                case "83":
                    Binary = "0x" + Hex(Lines[id].action_param1);
                    Comment = "Set NPC Flag ";
                    if (0x1 & Binary) {
                        Comment += "Gossip"
                    }
                    if (0x2 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Questgiver";
                        } else {
                            Comment += "Questgiver";
                        }
                    }
                    if (0x4 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", UNK 1";
                        } else {
                            Comment += "UNK 1";
                        }
                    }
                    if (0x8 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", UNK 2";
                        } else {
                            Comment += "UNK 2";
                        }
                    }
                    if (0x10 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Trainer";
                        } else {
                            Comment += "Trainer";
                        }
                    }
                    if (0x20 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Trainer Class";
                        } else {
                            Comment += "Trainer Class";
                        }
                    }
                    if (0x40 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Trainer Profession";
                        } else {
                            Comment += "Trainer Profession";
                        }
                    }
                    if (0x80 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Vendor";
                        } else {
                            Comment += "Vendor";
                        }
                    }
                    if (0x100 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Vendor Ammo";
                        } else {
                            Comment += "Vendor Ammo";
                        }
                    }
                    if (0x200 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Vendor Food";
                        } else {
                            Comment += "Vendor Food";
                        }
                    }
                    if (0x400 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Vendor Poison";
                        } else {
                            Comment += "Vendor Poison";
                        }
                    }
                    if (0x800 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Vendor Reagent";
                        } else {
                            Comment += "Vendor Reagent";
                        }
                    }
                    if (0x1000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Repair";
                        } else {
                            Comment += "Repair";
                        }
                    }
                    if (0x2000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Flightmaster";
                        } else {
                            Comment += "Flightmaster";
                        }
                    }
                    if (0x4000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Spirithealer";
                        } else {
                            Comment += "Spirithealer";
                        }
                    }
                    if (0x8000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Spiritguide";
                        } else {
                            Comment += "Spiritguide";
                        }
                    }
                    if (0x10000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Innkeeper";
                        } else {
                            Comment += "Innkeeper";
                        }
                    }
                    if (0x20000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Banker";
                        } else {
                            Comment += "Banker";
                        }
                    }
                    if (0x40000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Petitioner";
                        } else {
                            Comment += "Petitioner";
                        }
                    }
                    if (0x80000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Tabard Designer";
                        } else {
                            Comment += "Tabard Designer";
                        }
                    }
                    if (0x100000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Battle Master";
                        } else {
                            Comment += "Battle Master";
                        }
                    }
                    if (0x200000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Auctioneer";
                        } else {
                            Comment += "Auctioneer";
                        }
                    }
                    if (0x400000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Stable Master";
                        } else {
                            Comment += "Stable Master";
                        }
                    }
                    if (0x800000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Guild Banker";
                        } else {
                            Comment += "Guild Banker";
                        }
                    }
                    if (0x1000000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Spellclick";
                        } else {
                            Comment += "Spellclick";
                        }
                    }
                    if (0x4000000 & Binary) {
                        if (Comment != "Set NPC Flag ") {
                            Comment += ", Mailbox";
                        } else {
                            Comment += "Mailbox";
                        }
                    }
                    return replaceComma(Comment);
                    break;
                case "84":
                    return "Say Line " + Lines[id].action_param1;
                    break;
                case "85":
                    return "Invoker Cast '<a href='http://wowhead.com/spell=" + Lines[id].action_param1 + "'>" + getSpellName(Lines[id].action_param1) + "</a>'";
                    break;
                case "86":
                    return "Cross Cast '<a href='http://wowhead.com/spell=" + Lines[id].action_param1 + "'>" + getSpellName(Lines[id].action_param1) + "</a>'";
                    break;
                case "87":
                    return "Run Random Script";
                    break;
                case "88":
                    return "Run Random Script Between " + Lines[id].action_param1 + "-" + Lines[id].action_param2;
                    break;
                case "89":
                    return "Start Random Movement";
                    break;
                case "90":
                case "91":
                    Binary = "0x" + Hex(Lines[id].action_param1);
                    Comment = "Set Flag ";
                    if (Lines[id].action_param2 == "0") {
                        switch (Lines[id].action_param1) {
                            case "0":
                                return "Set Flag Stand Up";
                                break;
                            case "1":
                                return "Set Flag Sit Down";
                                break;
                            case "2":
                                return "Set Flag Sit Down Chair";
                                break;
                            case "3":
                                return "Set Flag Sleep";
                                break;
                            case "4":
                                return "Set Flag Sit Low Chair";
                                break;
                            case "5":
                                return "Set Flag Sit Medium Chair";
                                break;
                            case "6":
                                return "Set Flag Sit High Chair";
                                break;
                            case "7":
                                return "Set Flag Dead";
                                break;
                            case "8":
                                return "Set Flag Kneel";
                                break;
                            case "9":
                                return "Set Flag Submerged";
                                break;
                            default:
                                return;
                        }
                    }
                    if (Lines[id].action_param2 == "2") {
                        if (0x1 & Binary) {
                            Comment += "UNK1"
                        }
                        if (0x2 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", Creep";
                            } else {
                                Comment += "Creep";
                            }
                        }
                        if (0x4 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", Untrackable";
                            } else {
                                Comment += "Untrackable";
                            }
                        }
                        if (0x8 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", UNK 4";
                            } else {
                                Comment += "UNK 4";
                            }
                        }
                        if (0x10 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", UNK 5";
                            } else {
                                Comment += "UNK 5";
                            }
                        }
                        if (0xFF & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", All";
                            } else {
                                Comment += "All";
                            }
                        }
                        return replaceComma(Comment);
                    }
                    if (Lines[id].action_param2 == "3") {
                        if (0x1 & Binary) {
                            Comment += "Always Stand"
                        }
                        if (0x2 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", Hover";
                            } else {
                                Comment += "Hover";
                            }
                        }
                        if (0x4 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", UNK 3";
                            } else {
                                Comment += "UNK 3";
                            }
                        }
                        if (0xFF & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", All";
                            } else {
                                Comment += "All";
                            }
                        }
                        return replaceComma(Comment);
                    }
                    break;
                case "92":
                    return "Interrupt Spell '<a href='http://wowhead.com/spell=" + Lines[id].action_param1 + "'>" + getSpellName(Lines[id].action_param1) + "</a>'";
                    break;
                case "93":
                    return "Send Custom Animation " + Lines[id].action_param1;
                    break;
                case "94":
                case "95":
                case "96":
                    Binary = "0x" + Hex(Lines[id].action_param1);
                    Comment = "Set Flag ";
                    if (0x1 & Binary) {
                        Comment += "Lootable"
                    }
                    if (0x2 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Track Unit";
                        } else {
                            Comment += "Track Unit";
                        }
                    }
                    if (0x4 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Tapped";
                        } else {
                            Comment += "Tapped";
                        }
                    }
                    if (0x8 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Tapped By Player";
                        } else {
                            Comment += "Tapped By Player";
                        }
                    }
                    if (0x10 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Special Info";
                        } else {
                            Comment += "Special Info";
                        }
                    }
                    if (0x20 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Dead";
                        } else {
                            Comment += "Dead";
                        }
                    }
                    return replaceComma(Comment);
                    break;
                case "97":
                    return "Jump To Pos";
                    break;
                case "98":
                    return "Send Gossip Menu " + Lines[id].action_param1;
                    break;
                case "99":
                    switch (Lines[id].action_param1) {
                        case "0":
                            return "Set Lootstate Not Ready";
                            break;
                        case "1":
                            return "Set Lootstate Ready";
                            break;
                        case "2":
                            return "Set Lootstate Activated";
                            break;
                        case "3":
                            return "Set Lootstate Deactivated";
                            break;
                        default:
                            return;
                    }
                    break;
                case "100":
                    return "Send Target " + Lines[id].action_param1;
                    break;
                case "101":
                    return "Set Home Position";
                    break;
                case "102":
                    if (Lines[id].action_param1 == "0") {
                        return "Set Health Regeneration Off";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Set Health Regeneration On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "103":
                    if (Lines[id].action_param1 == "0") {
                        return "Set Root Off";
                    } else if (Lines[id].action_param1 == "1") {
                        return "Set Root On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "104":
                case "105":
                case "106":
                    Binary = "0x" + Hex(Lines[id].action_param1);
                    Comment = "Set Flag ";
                    if (0x1 & Binary) {
                        Comment += "In Use"
                    }
                    if (0x2 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Locked";
                        } else {
                            Comment += "Locked";
                        }
                    }
                    if (0x4 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Interact Cond";
                        } else {
                            Comment += "Interact Cond";
                        }
                    }
                    if (0x8 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Transport";
                        } else {
                            Comment += "Transport";
                        }
                    }
                    if (0x10 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Not Selectable";
                        } else {
                            Comment += "Not Selectable";
                        }
                    }
                    if (0x20 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", No Despawn";
                        } else {
                            Comment += "No Despawn";
                        }
                    }
                    if (0x40 & Binary) {
                        if (Comment != "Set Flag ") {
                            Comment += ", Triggered";
                        } else {
                            Comment += "Triggered";
                        }
                    }
                    return replaceComma(Comment);
                    break;
                case "107":
                    return "Summon Group " + Lines[id].action_param1;
                    break;
                case "108":
                    switch (Lines[id].action_param1) {
                        case "0":
                            return "Set Mana To " + Lines[id].action_param2;
                            break;
                        case "1":
                            return "Set Rage To " + Lines[id].action_param2;
                            break;
                        case "2":
                            return "Set Focus To " + Lines[id].action_param2;
                            break;
                        case "3":
                            return "Set Happiness To " + Lines[id].action_param2;
                            break;
                        case "5":
                            return "Set Health To " + Lines[id].action_param2;
                            break;
                        default:
                            return;
                    }
                    break;
                case "109":
                    switch (Lines[id].action_param1) {
                        case "0":
                            return "Add " + Lines[id].action_param2 + "Mana";
                            break;
                        case "1":
                            return "Add " + Lines[id].action_param2 + "Rage";
                            break;
                        case "2":
                            return "Add " + Lines[id].action_param2 + "Focus";
                            break;
                        case "3":
                            return "Add " + Lines[id].action_param2 + "Happiness";
                            break;
                        case "5":
                            return "Add " + Lines[id].action_param2 + "Health";
                            break;
                        default:
                            return;
                    }
                    break;
                case "110":
                    switch (Lines[id].action_param1) {
                        case "0":
                            return "Remove " + Lines[id].action_param2 + "Mana";
                            break;
                        case "1":
                            return "Remove " + Lines[id].action_param2 + "Rage";
                            break;
                        case "2":
                            return "Remove " + Lines[id].action_param2 + "Focus";
                            break;
                        case "3":
                            return "Remove " + Lines[id].action_param2 + "Happiness";
                            break;
                        case "5":
                            return "Remove " + Lines[id].action_param2 + "Health";
                            break;
                        default:
                            return;
                    }
                    break;
                case "111":
                    return "Stop Game Event " + Lines[id].action_param1;
                    break;
                case "112":
                    return "Start Game Event " + Lines[id].action_param1;
                    break;
                case "113":
                    if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 != "0" && Lines[id].action_param6 != "0") {
                        return "Pick Closest Waypoint (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "," + Lines[id].action_param3 + "," + Lines[id].action_param4 + "," + Lines[id].action_param5 + "&" + Lines[id].action_param6 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 != "0" && Lines[id].action_param6 == "0") {
                        return "Pick Closest Waypoint (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "," + Lines[id].action_param3 + "," + Lines[id].action_param4 + "&" + Lines[id].action_param5 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 != "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Pick Closest Waypoint (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "," + Lines[id].action_param3 + "&" + Lines[id].action_param4 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 != "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Pick Closest Waypoint (" + Lines[id].action_param1 + "," + Lines[id].action_param2 + "&" + Lines[id].action_param3 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 != "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        return "Pick Closest Waypoint (" + Lines[id].action_param1 + "&" + Lines[id].action_param2 + ")";
                    } else if (Lines[id].action_param1 != "0" && Lines[id].action_param2 == "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 2' should not be 0.");
                        return "Error";
                    } else if (Lines[id].action_param1 == "0" && Lines[id].action_param2 == "0" && Lines[id].action_param3 == "0" && Lines[id].action_param4 == "0" && Lines[id].action_param5 == "0" && Lines[id].action_param6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "150":
                case "151":
                    Binary = "0x" + Hex(Lines[id].action_param1);
                    Comment = "Set Flag ";
                    if (Lines[id].action_param2 == "0") {
                        switch (Lines[id].action_param1) {
                            case "0":
                                return "Set Sheathe Unarmed";
                                break;
                            case "1":
                                return "Set Sheathe Melee";
                                break;
                            case "2":
                                return "Set Sheathe Ranged";
                                break;
                            default:
                                return;
                        }
                    }
                    if (Lines[id].action_param2 == "1") {
                        if (0x1 & Binary) {
                            Comment += "UNK1"
                        }
                        if (0x2 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", UNK2";
                            } else {
                                Comment += "UNK2";
                            }
                        }
                        if (0x4 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", Sanctuary";
                            } else {
                                Comment += "Sanctuary";
                            }
                        }
                        if (0x8 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", Auras";
                            } else {
                                Comment += "Auras";
                            }
                        }
                        if (0x10 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", UNK 5";
                            } else {
                                Comment += "UNK 5";
                            }
                        }
                        if (0x20 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", UNK 6";
                            } else {
                                Comment += "UNK 6";
                            }
                        }
                        if (0x40 & Binary) {
                            if (Comment != "Set Flag ") {
                                Comment += ", UNK 7";
                            } else {
                                Comment += "UNK 7";
                            }
                        }
                    }
                    return replaceComma(Comment);
                    break;
                case "152":
                    return "Load Path " + Lines[id].action_param1;
                    break;
                case "153":
                    return "Teleport Target On Self";
                    break;
                case "154":
                    return "Teleport On Target";
                    break;
            }
        }
        function duplicateLine(id) {
            MaxID++;

            var BG = $('table > tbody > tr:has(td:first-child:contains("' + id + '"))').css('background-color');
            if (BG.length == 0 || BG == "rgb(245, 245, 245)") {
                BG = "";
            } else {
                BG = 'style="background-color: ' + BG + ';"';
            }

            $('<tr ' + BG + '>' +
            '<td><strong>' + MaxID + '</strong></td>' +
            '<td>' + Lines[id].link + '</td>' +
            '<td>' + Events[Lines[id].event_type].name.slice(6) + '</td>' +
            '<td>' + Actions[Lines[id].action_type].name.slice(7) + '</td>' +
            '<td>' + Targets[Lines[id].target_type].name.slice(7) + '</td>' +
            '<td>' + Lines[id].comment + '</td>' +
            '<td class="options">' +
            '   <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' +
            '   <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</td>' +
            '</tr>').appendTo('table > tbody');

            var New = {
                "entryorguid": Entry.toString(),
                "id": MaxID.toString(),
                "source_type": Lines[id].source_type,
                "comment": Lines[id].comment,
                "event_type": Lines[id].event_type,
                "event_chance": Lines[id].event_chance,
                "event_phase_mask": Lines[id].event_phase_mask,
                "event_flags": Lines[id].event_flags,
                "link":Lines[id].link,
                "event_param1": Lines[id].event_param1,
                "event_param2": Lines[id].event_param2,
                "event_param3":Lines[id].event_param3,
                "event_param4": Lines[id].event_param4,
                "action_type": Lines[id].action_type,
                "action_param1": Lines[id].action_param1,
                "action_param2": Lines[id].action_param2,
                "action_param3": Lines[id].action_param3,
                "action_param4": Lines[id].action_param4,
                "action_param5": Lines[id].action_param5,
                "action_param6": Lines[id].action_param6,
                "target_type": Lines[id].target_type,
                "target_flags": Lines[id].target_flags,
                "target_param1": Lines[id].target_param1,
                "target_param2": Lines[id].target_param2,
                "target_param3": Lines[id].target_param3,
                "target_x": Lines[id].target_x,
                "target_y": Lines[id].target_y,
                "target_z": Lines[id].target_z,
                "target_o": Lines[id].target_o
            };
            Lines[MaxID] = New;
            displayLine(MaxID, $('table > tbody > tr:has(td:first-child:contains("' + MaxID + '"))'));
            RefreshTable();
        }
        function addLine() {
            MaxID++;
            $('<tr>' +
            '<td><strong>' + MaxID + '</strong></td>' +
            '<td>0</td>' +
            '<td>' + Events[0].name.slice(6) + '</td>' +
            '<td>' + Actions[0].name.slice(7) + '</td>' +
            '<td>' + Targets[0].name.slice(7) + '</td>' +
            '<td>' + Name + ' -</td>' +
            '<td class="options">' +
            '   <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' +
            '   <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</td>' +
            '</tr>').appendTo('table > tbody');

            var New = {
                "entryorguid": Entry.toString,
                "id": MaxID.toString(),
                "source_type": Type.toString(),
                "comment": '"' + Name + ' -"',
                "event_type": "0",
                "event_chance": "100",
                "event_phase_mask": "0",
                "event_flags": "0",
                "link": "0",
                "event_param1": "0",
                "event_param2": "0",
                "event_param3": "0",
                "event_param4": "0",
                "action_type": "0",
                "action_param1": "0",
                "action_param2": "0",
                "action_param3": "0",
                "action_param4": "0",
                "action_param5": "0",
                "action_param6": "0",
                "target_type": "0",
                "target_flags": "0",
                "target_param1": "0",
                "target_param2": "0",
                "target_param3": "0",
                "target_x": "0",
                "target_y": "0",
                "target_z": "0",
                "target_o": "0"
            };
            Lines[MaxID] = New;
            displayLine(MaxID, 'table > tbody > tr:has(td:first-child:contains("' + MaxID + '"))');
            RefreshTable();
        }
        function deleteLine(id) {
            $('table > tbody > tr:has(td:first-child:contains("' + id + '"))').closest('tr').remove();
            delete Lines[id];
            MaxID = Object.keys(Lines).length - 1;   // Redefine MaxID to match the changes done to Lines

            displayLine(0, 'table > tbody > tr:has(td:first-child:contains(0))');
            RefreshTable();
        }
        function displayLine(id, line) {
            $(line).closest('tr').addClass('active').siblings('tr').removeClass('active');
            window.scrollTo(0, 0);

            $('#id_val').val(Lines[id].id);

            // Params Values
            $('#event_chance_val').val(Lines[id].event_chance);
            $('#link_val').val(Lines[id].link);
            displayEventVal(Lines[id].event_type, id);
            displayActionVal(Lines[id].action_type, id);
            displayTargetVal(Lines[id].target_type, id);

            // Params Names
            changeEventsParams(Lines[id]);
            changeActionsParams(Lines[id]);
            changeTargetsParams(Lines[id].target_type);

            if (Lines[id].event_flags != "0") {
                var SelectFlags = '#event_flags_value';
                var Binary = "0x" + Hex(Lines[id].event_flags);
                if (0x1 & Binary) {
                    $(SelectFlags + ' > option:first-child').attr('selected', 'selected');
                } else {
                    $(SelectFlags + ' > option:first-child').removeAttr('selected');
                }
                if (0x2 & Binary) {
                    $(SelectFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                } else {
                    $(SelectFlags + ' > option:nth-child(2)').removeAttr('selected');
                }
                if (0x4 & Binary) {
                    $(SelectFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                } else {
                    $(SelectFlags + ' > option:nth-child(3)').removeAttr('selected', 'selected');
                }
                if (0x8 & Binary) {
                    $(SelectFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                } else {
                    $(SelectFlags + ' > option:nth-child(4)').removeAttr('selected', 'selected');
                }
                if (0x10 & Binary) {
                    $(SelectFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                } else {
                    $(SelectFlags + ' > option:nth-child(5)').removeAttr('selected', 'selected');
                }
                if (0x20 & Binary) {
                    $(SelectFlags + ' > option:nth-child(6)').attr('selected', 'selected');
                } else {
                    $(SelectFlags + ' > option:nth-child(6)').removeAttr('selected', 'selected');
                }
            } else {
                SelectFlags = '#event_flags_value';
                $(SelectFlags + ' > option').removeAttr('selected');
            }
            if (Lines[id].event_phase_mask != "0") {
                var SelectPhase = '#event_phase_mask_value';
                Binary = "0x" + Hex(Lines[id].event_phase_mask);
                if (0x1 & Binary) {
                    $(SelectPhase + ' > option:first-child').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:first-child').removeAttr('selected');
                }
                if (0x2 & Binary) {
                    $(SelectPhase + ' > option:nth-child(2)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(2)').removeAttr('selected');
                }
                if (0x4 & Binary) {
                    $(SelectPhase + ' > option:nth-child(3)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(3)').removeAttr('selected', 'selected');
                }
                if (0x8 & Binary) {
                    $(SelectPhase + ' > option:nth-child(4)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(4)').removeAttr('selected', 'selected');
                }
                if (0x10 & Binary) {
                    $(SelectPhase + ' > option:nth-child(5)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(5)').removeAttr('selected', 'selected');
                }
                if (0x20 & Binary) {
                    $(SelectPhase + ' > option:nth-child(6)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(6)').removeAttr('selected', 'selected');
                }
                if (0x40 & Binary) {
                    $(SelectPhase + ' > option:nth-child(7)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(7)').removeAttr('selected', 'selected');
                }
                if (0x80 & Binary) {
                    $(SelectPhase + ' > option:nth-child(8)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(8)').removeAttr('selected', 'selected');
                }
                if (0x100 & Binary) {
                    $(SelectPhase + ' > option:nth-child(9)').attr('selected', 'selected');
                } else {
                    $(SelectPhase + ' > option:nth-child(9)').removeAttr('selected', 'selected');
                }
            } else {
                SelectPhase = '#event_phase_mask_value';
                $(SelectPhase + ' > option').removeAttr('selected');
            }
            if (Lines[id].target_flags != "0") {
                Binary = "0x" + Hex(Lines[id].target_flags);
                if (0x001 & Binary) {
                    $(SelectTargetFlags + ' > option:first-child').attr('selected', 'selected');
                } else {
                    $(SelectTargetFlags + ' > option:first-child').removeAttr('selected');
                }
                if (0x002 & Binary) {
                    $(SelectTargetFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                } else {
                    $(SelectTargetFlags + ' > option:nth-child(2)').removeAttr('selected');
                }
                if (0x004 & Binary) {
                    $(SelectTargetFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                } else {
                    $(SelectTargetFlags + ' > option:nth-child(3)').removeAttr('selected', 'selected');
                }
                if (0x008 & Binary) {
                    $(SelectTargetFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                } else {
                    $(SelectTargetFlags + ' > option:nth-child(4)').removeAttr('selected', 'selected');
                }
                if (0x010 & Binary) {
                    $(SelectTargetFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                } else {
                    $(SelectTargetFlags + ' > option:nth-child(5)').removeAttr('selected', 'selected');
                }
            } else {
                $(SelectTargetFlags + ' > option').removeAttr('selected');
            }
            $('.npc_flags').trigger('chosen:updated');
            $(SelectPhase).trigger('chosen:updated');
            $(SelectFlags).trigger('chosen:updated');
            $(SelectTargetFlags).trigger('chosen:updated');
            EventType.val(Lines[id].event_type).trigger('chosen:updated');
            ActionType.val(Lines[id].action_type).trigger('chosen:updated');
            TargetType.val(Lines[id].target_type).trigger('chosen:updated');
        }

        generateComments(Lines);
        $('#new_line').click(function () {
            addLine();
        });

        function displayEventVal(EventType, id) {
            switch (EventType) {
                case "5":
                    displayEventValDefault(1, id);
                    displayEventValDefault(2, id);
                    EventParam3DIV.empty();
                    $('<select class="form-control" id="event_param3_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(EventParam3DIV);
                    $('#event_param3_val').val(Lines[id].event_param3);
                    displayEventValDefault(4, id);
                    break;
                case "8":
                case "31":
                    displayEventValDefault(1, id);
                    EventParam2DIV.empty();
                    $('<select class="form-control" id="event_param2_val">' +
                    '   <option value="0">Any</option>' +
                    '   <option value="1">Holy</option>' +
                    '   <option value="2">Fire</option>' +
                    '   <option value="3">Nature</option>' +
                    '   <option value="4">Frost</option>' +
                    '   <option value="5">Shadow</option>' +
                    '   <option value="6">Arcane</option>' +
                    '</select>').appendTo(EventParam2DIV);
                    $('#event_param2_val').val(Lines[id].event_param2);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                case "10":
                case "26":
                    EventParam1DIV.empty();
                    $('<select class="form-control" id="event_param1_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(EventParam1DIV);
                    $('#event_param1_val').val(Lines[id].event_param1);
                    displayEventValDefault(2, id);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                case "34":
                    EventParam1DIV.empty();
                    $('<select class="form-control" id="event_param1_val">' +
                    '   <option value="0">Idle</option>' +
                    '   <option value="1">Random</option>' +
                    '   <option value="2">Waypoint</option>' +
                    '   <option value="3">Max DB</option>' +
                    '   <option value="4">Animal Random</option>' +
                    '   <option value="5">Confused</option>' +
                    '   <option value="6">Chase</option>' +
                    '   <option value="7">Home</option>' +
                    '   <option value="8">Flight</option>' +
                    '   <option value="9">Point</option>' +
                    '   <option value="10">Fleeing</option>' +
                    '   <option value="11">Distract</option>' +
                    '   <option value="12">Assistance</option>' +
                    '   <option value="13">Assistance Distract</option>' +
                    '   <option value="14">Timed Fleeing</option>' +
                    '   <option value="15">Follow</option>' +
                    '   <option value="16">Rotate</option>' +
                    '   <option value="17">Effect</option>' +
                    '</select>').appendTo(EventParam1DIV);
                    $('#event_param1_val').val(Lines[id].event_param1);
                    displayEventValDefault(2, id);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                default:
                    displayEventValDefault(1, id);
                    displayEventValDefault(2, id);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
            }
        }
        function displayActionVal(ActionType, id) {
            switch (ActionType) {
                case "4":
                case "39":
                case "107":
                    displayActionValDefault(1, id);
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    break;
                case "8":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Passive</option>' +
                    '   <option value="1">Defensive</option>' +
                    '   <option value="2">Aggressive</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    break;
                case "11": //ACTION_CAST
                case "85": //ACTION_INVOKER_CAST
                case "86": //ACTION_CROSS_CAST
                    displayActionValDefault(1, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);

                    ActionParam2.addClass('display_flags');
                    ActionParam2DIV.empty();
                    $('<select multiple class="form-control spell_flags" id="action_param2_val">' +
                    '   <option value="0">NONE</option>' +
                    '   <option value="1">INTERRUPT_PREVIOUS</option>' +
                    '   <option value="2">TRIGGERED</option>' +
                    '   <option value="32">AURA_NOT_PRESENT</option>' +
                    '   <option value="64">COMBAT_MOVE</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    var Flags = '#action_param2_val';
                    var Binary = "0x" + Hex(Lines[id].action_param2);
                    if (Lines[id].action_param2 == "0") {
                        $(Flags + ' > option:first-child').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:first-child').removeAttr('selected');
                    }
                    if (0x1 & Binary) {
                        $(Flags + ' > option:nth-child(2)').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:nth-child(2)').removeAttr('selected');
                    }
                    if (0x2 & Binary) {
                        $(Flags + ' > option:nth-child(3)').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:nth-child(3)').removeAttr('selected');
                    }
                    if (0x20 & Binary) {
                        $(Flags + ' > option:nth-child(4)').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:nth-child(4)').removeAttr('selected');
                    }
                    if (0x40 & Binary) {
                        $(Flags + ' > option:nth-child(5)').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:nth-child(5)').removeAttr('selected');
                    }
                    break;
                case "12":
                    displayActionValDefault(1, id);
                    ActionParam2.addClass('display_flags');
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val" style="width: 175px;">' +
                    '   <option value="1">TIMED_OR_DEAD_DESPAWN</option>' +
                    '   <option value="2">TIMED_OR_CORPSE_DESPAWN</option>' +
                    '   <option value="3">TIMED_DESPAWN</option>' +
                    '   <option value="4">TIMED_DESPAWN_OUT_OF_COMBAT</option>' +
                    '   <option value="5">CORPSE_DESPAWN</option>' +
                    '   <option value="6">CORPSE_TIMED_DESPAWN</option>' +
                    '   <option value="7">DEAD_DESPAWN</option>' +
                    '   <option value="8">MANUAL_DESPAWN</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    displayActionValDefault(3, id);
                    ActionParam4DIV.empty();
                    $('<select class="form-control" id="action_param4_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam4DIV);
                    $('#action_param4_val').val(Lines[id].action_param4);
                    ActionParam5DIV.empty();
                    $('<select class="form-control" id="action_param5_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam5DIV);
                    $('#action_param5_val').val(Lines[id].action_param5);
                    break;
                case "18": //ACTION_SET_UNIT_FLAG
                case "19": //ACTION_REMOVE_UNIT_FLAG
                    displayActionValDefault(2, id);
                    ActionParam1.addClass('display_flags');
                    ActionParam1DIV.empty();
                    if (Lines[id].action_param2 == "0") {
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">SERVER_CONTROLLED</option>' +
                        '   <option value="2">NON_ATTACKABLE</option>' +
                        '   <option value="4">DISABLE_MOVE</option>' +
                        '   <option value="8">PVP_ATTACKABLE</option>' +
                        '   <option value="16">RENAME</option>' +
                        '   <option value="32">PREPARATION</option>' +
                        '   <option value="64">UNK_6</option>' +
                        '   <option value="128">NOT_ATTACKABLE_1</option>' +
                        '   <option value="256">IMMUNE_TO_PC</option>' +
                        '   <option value="512">IMMUNE_TO_NPC</option>' +
                        '   <option value="1024">LOOTING</option>' +
                        '   <option value="2048">PET_IN_COMBAT</option>' +
                        '   <option value="4096">PVP</option>' +
                        '   <option value="8192">SILENCED</option>' +
                        '   <option value="16384">UNK_14</option>' +
                        '   <option value="32768">UNK_15</option>' +
                        '   <option value="65536">NOT_PL_SPELL_TARGET</option>' +
                        '   <option value="131072">PACIFIED</option>' +
                        '   <option value="262144">STUNNED</option>' +
                        '   <option value="524288">IN_COMBAT</option>' +
                        '   <option value="1048576">TAXI_FLIGHT</option>' +
                        '   <option value="2097152">DISARMED</option>' +
                        '   <option value="4194304">CONFUSED</option>' +
                        '   <option value="8388608">FLEEING</option>' +
                        '   <option value="16777216">PLAYER_CONTROLLED</option>' + //25
                        '   <option value="33554432">NOT_SELECTABLE</option>' +
                        '   <option value="67108864">SKINNABLE</option>' +
                        '   <option value="134217728">MOUNT</option>' +
                        '   <option value="268435456">UNK_28</option>' +
                        '   <option value="536870912">UNK_29</option>' +
                        '   <option value="1073741824">SHEATHE</option>' +
                        '   <option value="2147483648">UNK_31</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        if (0x0 & Binary) {
                            $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:first-child').removeAttr('selected');
                        }
                        if (0x1 & Binary) {
                            $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                        }
                        if (0x2 & Binary) {
                            $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                        }
                        if (0x4 & Binary) {
                            $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                        }
                        if (0x8 & Binary) {
                            $(NPCFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(5)').removeAttr('selected');
                        }
                        if (0x10 & Binary) {
                            $(NPCFlags + ' > option:nth-child(6)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(6)').removeAttr('selected');
                        }
                        if (0x20 & Binary) {
                            $(NPCFlags + ' > option:nth-child(7)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(7)').removeAttr('selected');
                        }
                        if (0x40 & Binary) {
                            $(NPCFlags + ' > option:nth-child(8)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(8)').removeAttr('selected');
                        }
                        if (0x80 & Binary) {
                            $(NPCFlags + ' > option:nth-child(9)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(9)').removeAttr('selected');
                        }
                        if (0x100 & Binary) {
                            $(NPCFlags + ' > option:nth-child(10)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(10)').removeAttr('selected');
                        }
                        if (0x200 & Binary) {
                            $(NPCFlags + ' > option:nth-child(11)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(11)').removeAttr('selected');
                        }
                        if (0x400 & Binary) {
                            $(NPCFlags + ' > option:nth-child(12)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(12)').removeAttr('selected');
                        }
                        if (0x800 & Binary) {
                            $(NPCFlags + ' > option:nth-child(13)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(13)').removeAttr('selected');
                        }
                        if (0x1000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(14)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(14)').removeAttr('selected');
                        }
                        if (0x2000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(15)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(15)').removeAttr('selected');
                        }
                        if (0x4000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(16)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(16)').removeAttr('selected');
                        }
                        if (0x8000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(17)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(17)').removeAttr('selected');
                        }
                        if (0x10000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(18)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(18)').removeAttr('selected');
                        }
                        if (0x20000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(19)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(19)').removeAttr('selected');
                        }
                        if (0x40000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(20)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(20)').removeAttr('selected');
                        }
                        if (0x80000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(21)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(21)').removeAttr('selected');
                        }
                        if (0x100000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(22)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(22)').removeAttr('selected');
                        }
                        if (0x200000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(23)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(23)').removeAttr('selected');
                        }
                        if (0x400000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(24)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(24)').removeAttr('selected');
                        }
                        if (0x800000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(25)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(25)').removeAttr('selected');
                        }
                        if (0x1000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(26)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(26)').removeAttr('selected');
                        }
                        if (0x2000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(27)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(27)').removeAttr('selected');
                        }
                        if (0x4000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(28)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(28)').removeAttr('selected');
                        }
                        if (0x8000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(29)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(29)').removeAttr('selected');
                        }
                        if (0x10000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(30)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(30)').removeAttr('selected');
                        }
                        if (0x20000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(31)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(31)').removeAttr('selected');
                        }
                        if (0x40000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(32)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(32)').removeAttr('selected');
                        }
                        if (0x80000000 & Binary) {
                            $(NPCFlags + ' > option:nth-child(33)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(33)').removeAttr('selected');
                        }
                    }
                    if (Lines[id].action_param2 == "1") {
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="1">FEIGN_DEATH</option>' +
                        '   <option value="8">COMPREHEND_LANG</option>' +
                        '   <option value="16">MIRROR_IMAGE</option>' +
                        '   <option value="64">FORCE_MOVE</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        if (0x1 & Binary) {
                            $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:first-child').removeAttr('selected');
                        }
                        if (0x8 & Binary) {
                            $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                        }
                        if (0x10 & Binary) {
                            $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                        }
                        if (0x40 & Binary) {
                            $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                        }
                    }
                    break;
                case "20":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Stop</option>' +
                    '   <option value="1">Start</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    break;
                case "21":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Disable</option>' +
                    '   <option value="1">Enable</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    break;
                case "22": //ACTION_SET_EVENT_PHASE
                case "23": //ACTION_INC_EVENT_PHASE
                case "30": //ACTION_RANDOM_PHASE
                case "31": //ACTION_RANDOM_PHASE_RANGE
                    displayActionValPower(1, id);
                    displayActionValPower(2, id);
                    displayActionValPower(3, id);
                    displayActionValPower(4, id);
                    displayActionValPower(5, id);
                    displayActionValPower(6, id);
                    break;
                case "25":
                case "47":
                case "48":
                case "59":
                case "60":
                case "61":
                case "102":
                case "103":
                case "153":
                case "154":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    break;
                case "29":
                    displayActionValDefault(1, id);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    ActionParam4DIV.empty();
                    $('<select class="form-control" id="action_param4_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam4DIV);
                    $('#action_param4_val').val(Lines[id].action_param4);
                    break;
                case "40":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Unarmed</option>' +
                    '   <option value="1">Melee</option>' +
                    '   <option value="1">Ranged</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    break;
                case "53":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Walk</option>' +
                    '   <option value="1">Run</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    ActionParam3DIV.empty();
                    $('<select class="form-control" id="action_param3_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam3DIV);
                    $('#action_param3_val').val(Lines[id].action_param3);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    ActionParam6DIV.empty();
                    $('<select class="form-control" id="action_param6_val">' +
                    '   <option value="0">Passive</option>' +
                    '   <option value="1">Defensive</option>' +
                    '   <option value="2">Aggressive</option>' +
                    '</select>').appendTo(ActionParam6DIV);
                    $('#action_param6_val').val(Lines[id].action_param6);
                    break;
                case "55":
                    displayActionValDefault(1, id);
                    displayActionValDefault(2, id);
                    ActionParam3DIV.empty();
                    $('<select class="form-control" id="action_param3_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam3DIV);
                    $('#action_param3_val').val(Lines[id].action_param3);
                    break;
                case "58":
                    ActionParam1.addClass('display_flags');
                    ActionParam1DIV.empty();
                    $('<select class="form-control flags" id="action_param1_val">' +
                    '   <option value="0">BASIC</option>' +
                    '   <option value="1">CASTER</option>' +
                    '   <option value="2">TURRET</option>' +
                    '   <option value="3">PASSIVE</option>' +
                    '   <option value="4">CAGED_GO_PART</option>' +
                    '   <option value="5">CAGED_NPC_PART</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);

                    switch(Lines[id].action_param1) {
                        case "4":
                            displayActionValDefault(2, id);
                            ActionParam3DIV.empty();
                            $('<select class="form-control" id="action_param3_val">' +
                            '   <option value="0">No</option>' +
                            '   <option value="1">Yes</option>' +
                            '</select>').appendTo(ActionParam3DIV);
                            $('#action_param3_val').val(Lines[id].action_param3);
                            break;
                        case "5":
                            displayActionValDefault(2, id);
                            displayActionValDefault(3, id);
                            ActionParam4DIV.empty();
                            $('<select class="form-control" id="action_param4_val">' +
                            '   <option value="0">No</option>' +
                            '   <option value="1">Yes</option>' +
                            '</select>').appendTo(ActionParam4DIV);
                            $('#action_param4_val').val(Lines[id].action_param4);
                            displayActionValDefault(5, id);
                            displayActionValDefault(6, id);
                            break;
                        default:
                            displayActionValDefault(2, id);
                            displayActionValDefault(3, id);
                            displayActionValDefault(4, id);
                            displayActionValDefault(5, id);
                            displayActionValDefault(6, id);
                    } break;
                case "80":
                    displayActionValDefault(1, id);
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                    '   <option value="0">UPDATE_OOC</option>' +
                    '   <option value="1">UPDATE_IC</option>' +
                    '   <option value="2">UPDATE</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    break;
                case "81": //ACTION_SET_NPC_FLAG
                case "82": //ACTION_ADD_NPC_FLAG
                case "83": //ACTION_REMOVE_NPC_FLAG
                    ActionParam1.addClass('display_flags');
                    ActionParam1DIV.empty();
                    $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                    '   <option value="0">NONE</option>' +
                    '   <option value="1">GOSSIP</option>' +
                    '   <option value="2">QUESTGIVER</option>' +
                    '   <option value="4">UNKNOWN1</option>' +
                    '   <option value="8">UNKNOWN2</option>' +
                    '   <option value="16">TRAINER</option>' +
                    '   <option value="32">TRAINER_CLASS</option>' +
                    '   <option value="64">TRAINER_PROFESSION</option>' +
                    '   <option value="128">VENDOR</option>' +
                    '   <option value="256">VENDOR_AMMO</option>' +
                    '   <option value="512">VENDOR_FOOD</option>' +
                    '   <option value="1024">VENDOR_POISON</option>' +
                    '   <option value="2048">VENDOR_REAGENT</option>' +
                    '   <option value="4096">REPAIR</option>' +
                    '   <option value="8192">FLIGHTMASTER</option>' +
                    '   <option value="16384">SPIRITHEALER</option>' +
                    '   <option value="32768">SPIRITGUIDE</option>' +
                    '   <option value="65536">INNKEEPER</option>' +
                    '   <option value="131072">BANKER</option>' +
                    '   <option value="262144">PETITIONER</option>' +
                    '   <option value="524288">TABARDDESIGNER</option>' +
                    '   <option value="1048576">BATTLEMASTER</option>' +
                    '   <option value="2097152">AUCTIONEER</option>' +
                    '   <option value="4194304">STABLEMASTER</option>' +
                    '   <option value="8388608">GUILD_BANKER</option>' +
                    '   <option value="16777216">SPELLCLICK</option>' +
                    '   <option value="67108864">MAILBOX</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    var NPCFlags = '#action_param1_val';
                    var Binary = "0x" + Hex(Lines[id].action_param1);
                    if (0x0 & Binary) {
                        $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:first-child').removeAttr('selected');
                    }
                    if (0x1 & Binary) {
                        $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                    }
                    if (0x2 & Binary) {
                        $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                    }
                    if (0x4 & Binary) {
                        $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                    }
                    if (0x8 & Binary) {
                        $(NPCFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(5)').removeAttr('selected');
                    }
                    if (0x10 & Binary) {
                        $(NPCFlags + ' > option:nth-child(6)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(6)').removeAttr('selected');
                    }
                    if (0x20 & Binary) {
                        $(NPCFlags + ' > option:nth-child(7)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(7)').removeAttr('selected');
                    }
                    if (0x40 & Binary) {
                        $(NPCFlags + ' > option:nth-child(8)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(8)').removeAttr('selected');
                    }
                    if (0x80 & Binary) {
                        $(NPCFlags + ' > option:nth-child(9)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(9)').removeAttr('selected');
                    }
                    if (0x100 & Binary) {
                        $(NPCFlags + ' > option:nth-child(10)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(10)').removeAttr('selected');
                    }
                    if (0x200 & Binary) {
                        $(NPCFlags + ' > option:nth-child(11)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(11)').removeAttr('selected');
                    }
                    if (0x400 & Binary) {
                        $(NPCFlags + ' > option:nth-child(12)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(12)').removeAttr('selected');
                    }
                    if (0x800 & Binary) {
                        $(NPCFlags + ' > option:nth-child(13)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(13)').removeAttr('selected');
                    }
                    if (0x1000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(14)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(14)').removeAttr('selected');
                    }
                    if (0x2000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(15)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(15)').removeAttr('selected');
                    }
                    if (0x4000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(16)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(16)').removeAttr('selected');
                    }
                    if (0x8000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(17)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(17)').removeAttr('selected');
                    }
                    if (0x10000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(18)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(18)').removeAttr('selected');
                    }
                    if (0x20000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(19)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(19)').removeAttr('selected');
                    }
                    if (0x40000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(20)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(20)').removeAttr('selected');
                    }
                    if (0x80000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(21)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(21)').removeAttr('selected');
                    }
                    if (0x100000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(22)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(22)').removeAttr('selected');
                    }
                    if (0x200000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(23)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(23)').removeAttr('selected');
                    }
                    if (0x400000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(24)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(24)').removeAttr('selected');
                    }
                    if (0x800000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(25)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(25)').removeAttr('selected');
                    }
                    if (0x1000000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(26)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(26)').removeAttr('selected');
                    }
                    if (0x4000000 & Binary) {
                        $(NPCFlags + ' > option:nth-child(27)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(27)').removeAttr('selected');
                    }
                    break;
                case "90": //ACTION_SET_UNIT_FIELD_BYTES_1
                case "91": //ACTION_REMOVE_UNIT_FIELD_BYTES_1
                    if (Lines[id].action_param2 == "0") {
                        ActionParam1.addClass('display_flags');
                        ActionParam1DIV.empty();
                        $('<select class="form-control" id="action_param1_val">' +
                        '   <option value="0">STAND</option>' +
                        '   <option value="1">SIT</option>' +
                        '   <option value="2">SIT_CHAIR</option>' +
                        '   <option value="3">SLEEP</option>' +
                        '   <option value="4">SIT_LOW_CHAIR</option>' +
                        '   <option value="5">SIT_MEDIUM_CHAIR</option>' +
                        '   <option value="6">SIT_HIGH_CHAIR</option>' +
                        '   <option value="7">DEAD</option>' +
                        '   <option value="8">KNEEL</option>' +
                        '   <option value="9">SUBMERGED</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        $('#action_param1_val').val(Lines[id].action_param1);
                    }
                    if (Lines[id].action_param2 == "2") {
                        ActionParam1.addClass('display_flags');
                        ActionParam1DIV.empty();
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">UNK1</option>' +
                        '   <option value="2">CREEP</option>' +
                        '   <option value="4">UNTRACKABLE</option>' +
                        '   <option value="8">UNK4</option>' +
                        '   <option value="16">UNK5</option>' +
                        '   <option value="255">ALL</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        if (0x0 & Binary) {
                            $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:first-child').removeAttr('selected');
                        }
                        if (0x1 & Binary) {
                            $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                        }
                        if (0x2 & Binary) {
                            $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                        }
                        if (0x4 & Binary) {
                            $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                        }
                        if (0x8 & Binary) {
                            $(NPCFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(5)').removeAttr('selected');
                        }
                        if (0x10 & Binary) {
                            $(NPCFlags + ' > option:nth-child(6)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(6)').removeAttr('selected');
                        }
                        if (0xFF & Binary) {
                            $(NPCFlags + ' > option:nth-child(7)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(7)').removeAttr('selected');
                        }
                    }
                    if (Lines[id].action_param2 == "3") {
                        ActionParam1.addClass('display_flags');
                        ActionParam1DIV.empty();
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">ALWAYS_STAND</option>' +
                        '   <option value="2">HOVER</option>' +
                        '   <option value="4">UNK3</option>' +
                        '   <option value="255">ALL</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        if (0x0 & Binary) {
                            $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:first-child').removeAttr('selected');
                        }
                        if (0x1 & Binary) {
                            $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                        }
                        if (0x2 & Binary) {
                            $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                        }
                        if (0x4 & Binary) {
                            $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                        }
                        if (0xFF & Binary) {
                            $(NPCFlags + ' > option:nth-child(7)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(7)').removeAttr('selected');
                        }
                    }

                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                    '   <option value="0">STAND_STATE_TYPE</option>' +
                    '   <option value="2">STAND_FLAGS_TYPE</option>' +
                    '   <option value="3">BYTES1_FLAGS_TYPE</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    break;
                case "92":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    ActionParam3DIV.empty();
                    $('<select class="form-control" id="action_param3_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam3DIV);
                    $('#action_param3_val').val(Lines[id].action_param3);
                    break;
                case "94": //ACTION_SET_DYNAMIC_FLAG
                case "95": //ACTION_ADD_DYNAMIC_FLAG
                case "96": //ACTION_REMOVE_DYNAMIC_FLAG
                    ActionParam1.addClass('display_flags');
                    ActionParam1DIV.empty();
                    $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                    '   <option value="0">NONE</option>' +
                    '   <option value="1">LOOTABLE</option>' +
                    '   <option value="2">TRACK_UNIT</option>' +
                    '   <option value="4">TAPPED</option>' +
                    '   <option value="8">TAPPED_BY_PLAYER</option>' +
                    '   <option value="16">SPECIALINFO</option>' +
                    '   <option value="32">DEAD</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    var NPCFlags = '#action_param1_val';
                    var Binary = "0x" + Hex(Lines[id].action_param1);
                    if (0x0 & Binary) {
                        $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:first-child').removeAttr('selected');
                    }
                    if (0x1 & Binary) {
                        $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                    }
                    if (0x2 & Binary) {
                        $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                    }
                    if (0x4 & Binary) {
                        $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                    }
                    if (0x8 & Binary) {
                        $(NPCFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(5)').removeAttr('selected');
                    }
                    if (0x10 & Binary) {
                        $(NPCFlags + ' > option:nth-child(6)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(6)').removeAttr('selected');
                    }
                    if (0x20 & Binary) {
                        $(NPCFlags + ' > option:nth-child(7)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(7)').removeAttr('selected');
                    }
                    break;
                case "104": //ACTION_SET_GO_FLAG
                case "105": //ACTION_ADD_GO_FLAG
                case "106": //ACTION_REMOVE_GO_FLAG
                    ActionParam1.addClass('display_flags');
                    ActionParam1DIV.empty();
                    $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                    '   <option value="0">NONE</option>' +
                    '   <option value="1">IN_USE</option>' +
                    '   <option value="2">LOCKED</option>' +
                    '   <option value="4">INTERACT_COND</option>' +
                    '   <option value="8">TRANSPORT</option>' +
                    '   <option value="16">NOT_SELECTABLE</option>' +
                    '   <option value="32">NO_DESPAWN</option>' +
                    '   <option value="64">TRIGGERED</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    var NPCFlags = '#action_param1_val';
                    var Binary = "0x" + Hex(Lines[id].action_param1);
                    if (0x0 & Binary) {
                        $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:first-child').removeAttr('selected');
                    }
                    if (0x1 & Binary) {
                        $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                    }
                    if (0x2 & Binary) {
                        $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                    }
                    if (0x4 & Binary) {
                        $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                    }
                    if (0x8 & Binary) {
                        $(NPCFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(5)').removeAttr('selected');
                    }
                    if (0x10 & Binary) {
                        $(NPCFlags + ' > option:nth-child(6)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(6)').removeAttr('selected');
                    }
                    if (0x20 & Binary) {
                        $(NPCFlags + ' > option:nth-child(7)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(7)').removeAttr('selected');
                    }
                    if (0x40 & Binary) {
                        $(NPCFlags + ' > option:nth-child(8)').attr('selected', 'selected');
                    } else {
                        $(NPCFlags + ' > option:nth-child(8)').removeAttr('selected');
                    }
                    break;
                case "108":
                case "109":
                case "110":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">MANA</option>' +
                    '   <option value="1">RAGE</option>' +
                    '   <option value="2">FOCUS</option>' +
                    '   <option value="4">HAPPINESS</option>' +
                    '   <option value="5">HEALTH</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    break;
                case "150": //ACTION_SET_UNIT_FIELD_BYTES_2
                case "151": //ACTION_REMOVE_UNIT_FIELD_BYTES_2
                    if (Lines[id].action_param2 == "0") {
                        ActionParam1.addClass('display_flags');
                        ActionParam1DIV.empty();
                        $('<select class="form-control" id="action_param1_val">' +
                        '   <option value="0">UNARMED</option>' +
                        '   <option value="1">MELEE</option>' +
                        '   <option value="2">RANGED</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        $('#action_param1_val').val(Lines[id].action_param1);
                    }
                    if (Lines[id].action_param2 == "1") {
                        ActionParam1.addClass('display_flags');
                        ActionParam1DIV.empty();
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">UNK1</option>' +
                        '   <option value="2">UNK2</option>' +
                        '   <option value="4">SANCTUARY</option>' +
                        '   <option value="8">AURAS</option>' +
                        '   <option value="16">UNK5</option>' +
                        '   <option value="32">UNK6</option>' +
                        '   <option value="64">UNK7</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        if (0x0 & Binary) {
                            $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:first-child').removeAttr('selected');
                        }
                        if (0x1 & Binary) {
                            $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                        }
                        if (0x2 & Binary) {
                            $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                        }
                        if (0x4 & Binary) {
                            $(NPCFlags + ' > option:nth-child(4)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(4)').removeAttr('selected');
                        }
                        if (0x8 & Binary) {
                            $(NPCFlags + ' > option:nth-child(5)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(5)').removeAttr('selected');
                        }
                        if (0x10 & Binary) {
                            $(NPCFlags + ' > option:nth-child(6)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(6)').removeAttr('selected');
                        }
                        if (0x20 & Binary) {
                            $(NPCFlags + ' > option:nth-child(7)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(7)').removeAttr('selected');
                        }
                        if (0x40 & Binary) {
                            $(NPCFlags + ' > option:nth-child(8)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(8)').removeAttr('selected');
                        }
                    }
                    if (Lines[id].action_param2 == "2") {
                        ActionParam1.addClass('display_flags');
                        ActionParam1DIV.empty();
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="2">NOT_ALLOWED</option>' +
                        '   <option value="3">ALLOWED</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        if (0x0 & Binary) {
                            $(NPCFlags + ' > option:first-child').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:first-child').removeAttr('selected');
                        }
                        if (0x2 & Binary) {
                            $(NPCFlags + ' > option:nth-child(2)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(2)').removeAttr('selected');
                        }
                        if (0x3 & Binary) {
                            $(NPCFlags + ' > option:nth-child(3)').attr('selected', 'selected');
                        } else {
                            $(NPCFlags + ' > option:nth-child(3)').removeAttr('selected');
                        }
                    }

                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                    '   <option value="0">SHEATH_STATE</option>' +
                    '   <option value="1">BYTES2_FLAGS_TYPE</option>' +
                    '   <option value="2">UNIT_RENAME</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    break;
                default:
                    displayActionValDefault(1, id);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
            }
        }
        function displayTargetVal(TargetType, id) {
    switch (TargetType) {
        case "19":
            displayTargetValDefault(1, id);
            displayTargetValDefault(2, id);
            TargetParam3DIV.empty();
            $('<select class="form-control" id="target_param3_val">' +
            '   <option value="0">No</option>' +
            '   <option value="1">Yes</option>' +
            '</select>').appendTo(TargetParam3DIV);
            $('#target_param3_val').val(Lines[id].target_param3);
            break;
        case "25":
        case "26":
            displayTargetValDefault(1, id);
            TargetParam2DIV.empty();
            $('<select class="form-control" id="target_param2_val">' +
            '   <option value="0">No</option>' +
            '   <option value="1">Yes</option>' +
            '</select>').appendTo(TargetParam2DIV);
            $('#target_param2_val').val(Lines[id].target_param2);
            displayTargetValDefault(2, id);
            break;
        default:
            displayTargetValDefault(1, id);
            displayTargetValDefault(2, id);
            displayTargetValDefault(3, id);
            displayTargetValDefault("x", id);
            displayTargetValDefault("y", id);
            displayTargetValDefault("z", id);
            displayTargetValDefault("o", id);
    }
}

        function displayEventValDefault(param, id) {
            var EventParam = $('#event_param' + param);
            var EventParamDIV = EventParam.next('div');
            var attr = 'event_param' + param;
            EventParam.removeClass('display_flags');
            EventParamDIV.empty();
            $('<input class="form-control" type="text" id="event_param' + param + '_val" />').appendTo(EventParamDIV);
            $('#event_param' + param + '_val').val(Lines[id][attr]);
        }
        function displayActionValDefault(param, id) {
            var ActionParam = $('#action_param' + param);
            var ActionParamDIV = ActionParam.next('div');
            var attr = 'action_param' + param;
            ActionParam.removeClass('display_flags');
            ActionParamDIV.empty();
            $('<input class="form-control" type="text" id="action_param' + param + '_val" />').appendTo(ActionParamDIV);
            $('#action_param' + param + '_val').val(Lines[id][attr]);
        }
        function displayActionValPower(param, id) {
            var ActionParam = $('#action_param' + param);
            var ActionParamDIV = ActionParam.next('div');
            var attr = 'action_param' + param;
            ActionParam.removeClass('display_flags');
            ActionParamDIV.empty();
            $('<input class="form-control" type="text" id="action_param' + param + '_val" />').appendTo(ActionParamDIV);
            $('#action_param' + param + '_val').val(getPower(Lines[id][attr]));
        }
        function displayTargetValDefault(param, id) {
            if (param == "x" || param == "y" || param == "z" || param == "o") {
                var TargetParam = $('#target_' + param);
                var TargetParamDIV = TargetParam.next('div');
                var attr = 'target_' + param;
                TargetParamDIV.empty();
                $('<input class="form-control" type="text" id="target_' + param + '_val" />').appendTo(TargetParamDIV);
                $('#target_' + param + '_val').val(Lines[id][attr]);
            } else {
                TargetParam = $('#target_param' + param);
                TargetParamDIV = TargetParam.next('div');
                attr = 'target_param' + param;
                TargetParam.removeClass('display_flags');
                TargetParamDIV.empty();
                $('<input class="form-control" type="text" id="target_param' + param + '_val" />').appendTo(TargetParamDIV);
                $('#target_param' + param + '_val').val(Lines[id][attr]);
            }
        }

        EventType.chosen({search_contains: true}).change(function () {
            var value = $(this).val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            displayEventVal(value, id);

            Lines[id].event_type = value;
            $('table > tbody > tr.active > td:nth-child(3)').text(Events[value].name.slice(6));
            changeEventsParams(Lines[id]);
        });
        ActionType.chosen({search_contains: true}).change(function () {
            var value = $(this).val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            displayActionVal(value, id);

            Lines[id].action_type = value;
            $('table > tbody > tr.active > td:nth-child(4)').text(Actions[value].name.slice(7));
            changeActionsParams(Lines[id]);
        });
        TargetType.chosen({search_contains: true}).change(function () {
            var value = $(this).val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            displayTargetVal(value, id);

            Lines[id].target_type = value;
            $('table > tbody > tr.active > td:nth-child(5)').text(Targets[value].name.slice(7));
            changeTargetsParams(value);
        });

        $('#id_val').change(function () {
            var OLD = $('table > tbody > tr.active > td:first-child').text();
            var ID = $(this).val();
            var CHECK = 0;
            $('table > tbody > tr > td:first-child').each(function () {
                if ($(this).text() == ID) {
                    alert('Error\nYou cannot change the ID to an already existent line. Change to an non in use ID.');
                    $('#id_val').val(OLD);
                    CHECK = 1;
                }
            });
            if (CHECK != 1) {
                Lines[ID] = Lines[OLD];
                delete Lines[OLD];
                Lines[ID].id = ID;
                $('table > tbody > tr.active > td:first-child').attr('onclick', 'displayLine(' + ID + ', this)').html('<strong>' + $(this).val() + '</strong>');
                $('table > tbody > tr.active > td:nth-child(2)').attr('onclick', 'displayLine(' + ID + ', this)');
                $('table > tbody > tr.active > td:nth-child(3)').attr('onclick', 'displayLine(' + ID + ', this)');
                $('table > tbody > tr.active > td:nth-child(4)').attr('onclick', 'displayLine(' + ID + ', this)');
                $('table > tbody > tr.active > td:nth-child(5)').attr('onclick', 'displayLine(' + ID + ', this)');
                $('table > tbody > tr.active > td:nth-child(6)').attr('onclick', 'displayLine(' + ID + ', this)');
            }
        });
        $('#link_val').change(function () {
            var Link = $('table > tbody > tr.active > td:nth-child(2)');
            var id = $('table > tbody > tr.active > td:first-child').text();
            Lines[id].link = $(this).val();
            Link.text($(this).val());
        });
        EventParam1DIV.on("change", '#event_param1_val', function () {
            setEventParamValue(1);
        });
        EventParam2DIV.on("change", '#event_param2_val', function () {
            setEventParamValue(2);
        });
        EventParam3DIV.on("change", '#event_param3_val', function () {
            var id = $('table > tbody > tr.active > td:first-child').text();
            setEventParamValue(3);

            // Refresh the line
            if (Lines[id].event_type == "5") {
                displayLine(id, Lines);
            }
        });
        EventParam4DIV.on("change", '#event_param4_val', function () {
            setEventParamValue(4);
        });

        ActionParam1DIV.on("change", '#action_param1_val', function () {
            var id = $('table > tbody > tr.active > td:first-child').text();
            setActionParamValue(1);

            // Refresh the line
            if (Lines[id].action_type == "58") {
                displayLine(id, Lines);
            }
        });
        ActionParam2DIV.on("change", '#action_param2_val', function () {
            var id = $('table > tbody > tr.active > td:first-child').text();
            setActionParamValue(2);

            // Refresh the line
            if (Lines[id].action_type == "150" ||
                Lines[id].action_type == "151" ||
                Lines[id].action_type == "90" ||
                Lines[id].action_type == "91") {
                displayLine(id, Lines);
            }
        });
        ActionParam3DIV.on("change", '#action_param3_val', function () {
            setActionParamValue(3);
        });
        ActionParam4DIV.on("change", '#action_param4_val', function () {
            setActionParamValue(4);
        });
        ActionParam5DIV.on("change", '#action_param5_val', function () {
            setActionParamValue(5);
        });
        ActionParam6DIV.on("change", '#action_param6_val', function () {
            setActionParamValue(6);
        });

        TargetParam1DIV.on("change", '#target_param1_val', function () {
            setTargetParamValue(1);
        });
        TargetParam2DIV.on("change", '#target_param2_val', function () {
            setTargetParamValue(2);
        });
        TargetParam3DIV.on("change", '#target_param3_val', function () {
            setTargetParamValue(3);
        });
        $('#target_x_val').change(function () {
            setTargetParamValue("x");
        });
        $('#target_y_val').change(function () {
            setTargetParamValue("y");
        });
        $('#target_z_val').change(function () {
            setTargetParamValue("z");
        });
        $('#target_o_val').change(function () {
            setTargetParamValue("o");
        });

        function setEventParamValue(param) {
            var attr = 'event_param' + param;
            var value = $('#event_param' + param + '_val').val();
            var id = $('table > tbody > tr.active > td:first-child').text();
            Lines[id][attr] = value;
        }
        function setActionParamValue(param) {
            var attr = 'action_param' + param;
            var value = $('#action_param' + param + '_val').val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            var total = 0;
            switch (ActionType.val()) {
                case "11": //ACTION_CAST
                case "85": //ACTION_INVOKER_CAST
                case "86": //ACTION_CROSS_CAST
                    Lines[id][attr] = value;
                    if (param == 2) {
                        for (i = 0; i < value.length; i++) {
                            total += value[i] << 0;
                        }
                        Lines[id][attr] = total;
                    }
                    break;
                case "30": //ACTION_RANDOM_PHASE
                    if (value > 2) {
                        Lines[id][attr] = Math.pow(2, value - 1);
                    }
                    break;
                case "18": //ACTION_SET_UNIT_FLAG
                case "19": //ACTION_REMOVE_UNIT_FLAG
                case "81": //ACTION_SET_NPC_FLAG
                case "82": //ACTION_ADD_NPC_FLAG
                case "83": //ACTION_REMOVE_NPC_FLAG
                case "94": //ACTION_SET_DYNAMIC_FLAG
                case "95": //ACTION_ADD_DYNAMIC_FLAG
                case "96": //ACTION_REMOVE_DYNAMIC_FLAG
                    if (param == 1) {
                        for (i = 0; i < value.length; i++) {
                            total += value[i] << 0;
                        }
                        Lines[id][attr] = total;
                    }
                    break;
                case "90": //ACTION_SET_UNIT_FIELD_BYTES_1
                case "91": //ACTION_REMOVE_UNIT_FIELD_BYTES_1
                    if (param == 2 || param == 3) {
                        for (i = 0; i < value.length; i++) {
                            total += value[i] << 0;
                        }
                        Lines[id][attr] = total;
                    }
                    break;
                case "150": //ACTION_SET_UNIT_FIELD_BYTES_2
                case "151": //ACTION_REMOVE_UNIT_FIELD_BYTES_2
                    if (param == 1 || param == 2) {
                        for (i = 0; i < value.length; i++) {
                            total += value[i] << 0;
                        }
                        Lines[id][attr] = total;
                    }
                    break;
                default:
                    Lines[id][attr] = value;
            }
        }
        function setTargetParamValue(param) {
            var id = $('table > tbody > tr.active > td:first-child').text();
            if (param == "x" || param == "y" || param == "z" || param == "o") {
                var attr = 'target_' + param;
                var value = $('#target_' + param + '_val').val();
            } else {
                attr = 'target_param' + param;
                value = $('#target_param' + param + '_val').val();
            }
            Lines[id][attr] = value;
        }

        function target(coord) {
            if ($('#target_' + coord).text() == "") {
                $('#target_' + coord + '_val').hide();
            } else {
                $('#target_' + coord + '_val').show();
            }
        }
        function changeEventsParams(Line) {
            switch (Line.event_type) {
                case "5": //EVENT_KILL
                    EventParam1.html(Events[Line.event_type].param1);
                    EventParam2.html(Events[Line.event_type].param2);
                    EventParam3.html(Events[Line.event_type].param3);
                    if (Line.event_param3 == "0") {
                        EventParam4.html('Creature ID');
                    } else {
                        EventParam4.html('');
                    }
                    break;
                default:
                    EventParam1.html(Events[Line.event_type].param1);
                    EventParam2.html(Events[Line.event_type].param2);
                    EventParam3.html(Events[Line.event_type].param3);
                    EventParam4.html(Events[Line.event_type].param4);
            }
            for (i = 0; i < 5; i++) {
                if ($('#event_param' + i).text() == "" || Line.event_type == "61") {
                    $('#event_param' + i + '_val').hide();
                } else {
                    $('#event_param' + i + '_val').show();
                }
            }
        }
        function changeActionsParams(Line) {
            switch (Line.action_type) {
                case "58": //ACTION_INSTALL_AI_TEMPLATE
                    ActionParam1.html('Template');
                    switch (Line.action_param1) {
                        case "1":
                        case "2":
                            ActionParam2.html('Spell ID');
                            ActionParam3.html('RepeatMin');
                            ActionParam4.html('RepeatMax');
                            ActionParam5.html('Range');
                            ActionParam6.html('Mana %');
                            break;
                        case "4":
                            ActionParam2.html('GO entry');
                            ActionParam3.html('Credit at end (0/1)');
                            ActionParam4.html('');
                            ActionParam5.html('');
                            ActionParam6.html('');
                            break;
                        case "5":
                            ActionParam2.html('Creature entry');
                            ActionParam3.html('Despawn time');
                            ActionParam4.html('Walk/Run (0/1)');
                            ActionParam5.html('Distance');
                            ActionParam6.html('GroupID');
                            break;
                        default:
                            ActionParam2.html('');
                            ActionParam3.html('');
                            ActionParam4.html('');
                            ActionParam5.html('');
                            ActionParam6.html('');
                    }
                    break;
                default:
                    ActionParam1.html(Actions[Line.action_type].param1);
                    ActionParam2.html(Actions[Line.action_type].param2);
                    ActionParam3.html(Actions[Line.action_type].param3);
                    ActionParam4.html(Actions[Line.action_type].param4);
                    ActionParam5.html(Actions[Line.action_type].param5);
                    ActionParam6.html(Actions[Line.action_type].param6);
            }
            for (i = 0; i < 7; i++) {
                if ($('#action_param' + i).text() == "") {
                    $('#action_param' + i + '_val').hide();
                } else {
                    $('#action_param' + i + '_val').show();
                }
            }
        }
        function changeTargetsParams(value) {
            $('#target_param1').html(Targets[value].param1);
            $('#target_param2').html(Targets[value].param2);
            $('#target_param3').html(Targets[value].param3);
            $('#target_x').html(Targets[value].target_x);
            $('#target_y').html(Targets[value].target_y);
            $('#target_z').html(Targets[value].target_z);
            $('#target_o').html(Targets[value].target_o);
            for (i = 0; i < 4; i++) {
                if ($('#target_param' + i).text() == "") {
                    $('#target_param' + i + '_val').hide();
                } else {
                    $('#target_param' + i + '_val').show();
                }
            }
            target("x");
            target("y");
            target("z");
            target("o");
        }
        function getPower(int) {
            var i;
            if (int > 2) {
                for (i = 0; int != 1; i++) {
                    int = int / 2;
                }
                return i + 1;
            } else {
                return int;
            }
        }

        function getSpellName(id) {
            var Data;
            $.ajax({
                type: 'GET',
                url: '/spell/' + id + '/name',
                async: false,
                dataType: 'text',
                'success': function (data) {
                    Data = data;
                }
            });
            return Data;
        }
        function getCreatureName(id) {
            var Data;
            $.ajax({
                type: 'GET',
                url: '/smartai/creature/entry/' + id + '/name',
                async: false,
                dataType: 'text',
                'success': function (data) {
                    Data = data;
                }
            });
            return Data;
        }
        function getGOName(id) {
            var Data;
            $.ajax({
                type: 'GET',
                url: '/smartai/gameobject/entry/' + id + '/name',
                async: false,
                dataType: 'text',
                'success': function (data) {
                    Data = data;
                }
            });
            return Data;
        }
        function getQuestName(id) {
            var Data;
            $.ajax({
                type: 'GET',
                url: '/quest/' + id + '/name',
                async: false,
                dataType: 'text',
                'success': function (data) {
                    Data = data;
                }
            });
            return Data;
        }
        function getItemName(id) {
            var Data;
            $.ajax({
                type: 'GET',
                url: '/item/' + id + '/name',
                async: false,
                dataType: 'text',
                'success': function (data) {
                    Data = data;
                }
            });
            return Data;
        }
        function RGB2Hex(rgb) {
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
        }
        function Hex(d) {
            return (+d).toString(16).toUpperCase();
        }
    }
})(jQuery);