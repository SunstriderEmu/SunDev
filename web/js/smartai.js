(function($)
{
    /**
     * HOW TO ADD A SMART_EVENT
     *  1. Add a new row in smartai_events
     *  2. Add a new case in the function generateEventComment()
     *  If your event requires a specific display:
     *  3. Add a new case in displayEventVal()
     * --
     * HOW TO ADD A SMART_ACTION
     *  1. Add a new row in smartai_actions
     *  2. Add a new case in the function generateActionComment()
     *  If your action requires a specific display:
     *  3. Add a new case in displayActionVal()
     * --
     * HOW TO ADD A SMART_TARGET
     *  1. Add a new row in smartai_targets
     *  If your target requires a specific display:
     *  2. Add a new case in displayTargetVal()
     */
    $.fn.smartai=function(informations) {
        var Entry = informations.Entry;
        var Type = informations.Type;
        var Name = informations.Name;
        var Lines = informations.Lines;
        var Events = informations.Events;
        var Actions = informations.Actions;
        var Targets = informations.Targets;
        var Patch = 0;

        var Info = { "entryorguid": Entry, "source_type": Type };
        
       function getMaxID(Lines)
        {
            if (jQuery.isEmptyObject(Lines))
                return -1;
            else
            {
                var ID;
                $.each(Lines, function(){
                    ID = parseInt(this.id);
                });
                return ID;
            }
        }
        var MaxID = getMaxID(Lines);

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

        var TargetX = $('#target_x');
        var TargetY = $('#target_y');
        var TargetZ = $('#target_z');
        var TargetO = $('#target_o');
        var TargetXDIV = TargetX.next('div');
        var TargetYDIV = TargetY.next('div');
        var TargetZDIV = TargetZ.next('div');
        var TargetODIV = TargetO.next('div');

        var SelectTargetFlags = '#target_flags_value';
        var i;

        PHASE = {
            1: "#8CDAFE",
            2: "#FA91AC",
            3: "#96E5B8",
            4: "#F89289",
            5: "#DFAAF5",
            6: "#FBE48B",
            7: "#F8BC9A",
            8: "#DEE1E3",
            9: "#89ADF8"
        };

        // Launch functions
        RefreshTable();
        generateComments(Lines);

        function RefreshTableTr(tr) {
            var td;
            if(tr == 1)
                td = 'first-child';
            else
                td = 'nth-child('+tr+')';

            $('table > tbody > tr > td:'+td).click(function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                displayLine(id, this);
            });
        }
        function RefreshTable() {
            RefreshTableTr(1);
            RefreshTableTr(2);
            RefreshTableTr(3);
            RefreshTableTr(4);
            RefreshTableTr(5);
            RefreshTableTr(6);
            RefreshTableTr(7);
            $('table > tbody > tr > td:nth-child(8)').off().on('click', 'span.glyphicon-plus', function () {
                var id = $(this).closest('tr').find('td:first-child').text();
                duplicateLine(id);
            });
            $('table > tbody > tr > td:nth-child(8) > span.glyphicon-remove').click(function () {
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
                setPhaseColor(Color, 0x1, Binary, 1);
                setPhaseColor(Color, 0x2, Binary, 2);
                setPhaseColor(Color, 0x4, Binary, 3);
                setPhaseColor(Color, 0x8, Binary, 4);
                setPhaseColor(Color, 0x10, Binary, 5);
                setPhaseColor(Color, 0x20, Binary, 6);
                setPhaseColor(Color, 0x40, Binary, 7);
                setPhaseColor(Color, 0x80, Binary, 8);
                setPhaseColor(Color, 0x100, Binary, 9);
            }
            $(this).css('background-color', generatePhaseColor(Color));
        });

        function updateChosen(Element, attribute) {
            $(Element).chosen().change(function () {
                var Value = $(this).val() || [];
                var ID = $('table > tbody > tr.active > td:first-child').text();
                if (ID == "")
                    alert('Please choose a line');
                var total = 0;
                for (var i = 0; i < Value.length; i++)
                    total += Value[i] << 0;
                Lines[ID][attribute] = total;
                $(this).trigger('chosen:updated');
            });
        }
        updateChosen('#event_phase_mask_value', 'event_phase_mask');
        updateChosen('#event_flags_value', 'event_flags');
        updateChosen('#target_flags_value', 'target_flags');
        function generateComments(Lines) {
            for (var i in Lines) {
                var TR = $('td:first-child').filter(function() { return $.text([this]) == i; }).closest('tr');
                var ID = $('td:first-child').filter(function() { return $.text([this]) == i; }).closest('tr').find('> td:first-child').text();
                var Comment = Name + ' - ' + generateEventComment(ID) + ' - ' + generateActionComment(ID) + " " + generateFlagsComment(ID) + generatePhaseComment(ID);
                TR.find('td:nth-child(6)').html(Comment);
                Lines[ID].comment = Comment;
            }
        }


        // Buttons
        $('#new_line').click(function () {
            addLine();
        });
        $('#generate_comments').click(function () {
            generateComments(Lines);
        });
        $('#review').click(function () {
            generateComments(Lines);
            review(generateData(Lines), Info);
        });
        $('#apply').click(function () {
            generateComments(Lines);
            apply(generateData(Lines), Info);
        });
        $('#validate').click(function () {
            generateComments(Lines);
            validate(generateData(Lines), Info);
        });
        $('#refuse').click(function () {
            generateComments(Lines);
            refuse(generateData(Lines), Info);
        });

        function generateData(Lines) {
            var Data = [];
            $.each(Object.keys(Lines), function(index, i) {
                Data.push([Lines[i].id, Lines[i].link, Lines[i].event_type, Lines[i].event_phase_mask, Lines[i].event_chance, Lines[i].event_flags, Lines[i].event_param1, Lines[i].event_param2, Lines[i].event_param3, Lines[i].event_param4, Lines[i].action_type, Lines[i].action_param1, Lines[i].action_param2, Lines[i].action_param3, Lines[i].action_param4, Lines[i].action_param5, Lines[i].action_param6, Lines[i].target_type, Lines[i].target_flags, Lines[i].target_param1, Lines[i].target_param2, Lines[i].target_param3, Lines[i].target_x, Lines[i].target_y, Lines[i].target_z, Lines[i].target_o, Lines[i].comment.replace(/'/g, '"').toString(), Lines[i].patch_min, Lines[i].patch_max]);
            });
            return Data;
        }

        // Replace the last comma with " and "
        function replaceComma(string) {
            if (string.indexOf(",") === -1)
                return string;
            var pos = string.lastIndexOf(',');
            return string.substring(0, pos) + ' and ' + string.substring(pos + 1);
        }

        function generateFlagsComment(id) {
            if (Lines[id].event_flags == "0")
                return "";
            var Binary = "0x" + Hex(Lines[id].event_flags);
            var Return = "(";
            Return = generateBitComment('(', Return, Binary, 0x1, 'No Repeat');
            Return = generateBitComment('(', Return, Binary, 0x2, 'Normal Dungeon');
            Return = generateBitComment('(', Return, Binary, 0x4, 'Heroic Dungeon');
            Return = generateBitComment('(', Return, Binary, 0x8, 'Normal Raid');
            Return = generateBitComment('(', Return, Binary, 0x10, 'Heroic Raid');
            Return = generateBitComment('(', Return, Binary, 0x80, 'Debug');
            Return = generateBitComment('(', Return, Binary, 0x100, "Don't Reset");
            Return = generateBitComment('(', Return, Binary, 0x200, 'While Charmed');
            Return += ")";
            if (Return == "()")
                return "";
            return replaceComma(Return);
        }
        function getPhaseColorComment(Color, String, Mask, Binary, Phase) {
            var Return = { "string": String };
            if (Mask & Binary) {
                Color.push(parseInt(Object.keys(PHASE)[Phase]));
                if (Return.string != "(")
                    Return.string += ", Phase " + Phase;
                else
                    Return.string += "Phase " + Phase;
            }
            Return.color = [];
            Return.color = Color;
            return Return;
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
            var Result;
            Result = getPhaseColorComment(Color, Return, 0x1, Binary, 1);
            Result = getPhaseColorComment(Color, Result.string, 0x2, Binary, 2);
            Result = getPhaseColorComment(Color, Result.string, 0x4, Binary, 3);
            Result = getPhaseColorComment(Color, Result.string, 0x8, Binary, 4);
            Result = getPhaseColorComment(Color, Result.string, 0x10, Binary, 5);
            Result = getPhaseColorComment(Color, Result.string, 0x20, Binary, 6);
            Result = getPhaseColorComment(Color, Result.string, 0x40, Binary, 7);
            Result = getPhaseColorComment(Color, Result.string, 0x80, Binary, 8);
            Result = getPhaseColorComment(Color, Result.string, 0x100, Binary, 9);
            Return = Result.string;
            Return += ")";
            TR.css('background-color', generatePhaseColor(Color));
            return replaceComma(Return);
        }
        function generatePhaseColor(Color) {
            if (Color.length > 1) {
                var PhaseColor = PHASE[Color[0]];
                for (i = 1; i < Color.length - 1; i++)
                    PhaseColor = $.xcolor.average(PhaseColor, PHASE[Color[i]]).getHex();
                return PhaseColor;
            } else
                return PHASE[Color[0]];
        }
        function generateEventComment(id) {
            var EventParam1 = Lines[id].event_param1;
            var EventParam2 = Lines[id].event_param2;
            var EventParam3 = Lines[id].event_param3;
            var EventParam4 = Lines[id].event_param4;
            switch (Lines[id].event_type) {
                case "0":
                    return "In Combat";
                case "1":
                    return "Out of Combat";
                case "2":
                    return "Between " + EventParam1 + "-" + EventParam2 + "% HP";
                case "3":
                    return "Between " + EventParam1 + "-" + EventParam2 + "% MP";
                case "4":
                    return "On Aggro";
                case "5":
                    if (EventParam3 == "0" && EventParam4 > "0")
                        return "On '<a href='http://wowhead.com/npc=" + EventParam1 + "'>" + getCreatureName(EventParam4) + "</a>' Killed";
                    else if (EventParam3 == "1")
                        return "On Player Killed";
                    else {
                        return "On Killed Unit";
                    }
                case "6":
                    return "On Death";
                case "7":
                    return "On Evade";
                case "8":
                    return "On Spellhit '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                case "9":
                    return "Within " + EventParam1 + "-" + EventParam2 + " Range";
                case "10":
                    return "Within " + EventParam1 + "-" + EventParam2 + " Range OOC LoS";
                case "11":
                    return "On Respawn";
                case "12":
                    return "Target Between " + EventParam1 + "-" + EventParam2 + "% HP";
                case "13":
                    return "On Victim Casting '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                case "14":
                    return "On Friendly at '" + EventParam1 + "' HP";
                case "15":
                    return "On Friendly CCed";
                case "16":
                    return "On Friendly Missing Buff '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                case "17":
                    return "On Summon '<a href='http://wowhead.com/npc=" + EventParam1 + "'>" + getCreatureName(EventParam1) + "</a>'";
                case "18":
                    return "Target Between " + EventParam1 + "-" + EventParam2 + "% MP";
                case "19":
                    return "On Quest '<a href='http://wowhead.com/quest=" + EventParam1 + "'>" + getQuestName(EventParam1) + "</a>' Accepted";
                case "20":
                    return "On Quest '<a href='http://wowhead.com/quest=" + EventParam1 + "'>" + getQuestName(EventParam1) + "</a>' Rewarded";
                case "21":
                    return "On Reached Home";
                case "22":
                    return "On Received Emote " + EventParam1;
                case "23":
                    if (EventParam2 > "0")
                        return "On Has Aura '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    else if (EventParam2 == "0")
                        return "On Missing Aura '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    else {
                        alert("Error:\nLine " + id + ": 'Stacks' is negative.");
                        return "Error: Param2 is negative";
                    }
                case "24":
                    if (EventParam2 > "0")
                        return "On Target Buffed With '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    else if (EventParam2 == "0")
                        return "On Target Missing Aura '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    else {
                        alert("Error:\nLine " + id + ": 'Stacks' is negative.");
                        return "Error: Param2 is negative";
                    }
                case "25":
                    return "On Reset";
                case "26":
                    return "In Combat LoS";
                case "27":
                    return "On Passenger Boarded";
                case "28":
                    return "On Passenger Removed";
                case "29":
                    return "On " + (EventParam1 == 1 ? "Remove " : "") + "Charmed";
                case "30":
                    return "On Target Charmed";
                case "31":
                    return "On Target Spellhit '<a href='http://wowhead.com/spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                case "32":
                    return "On Damaged Between " + EventParam1 + "-" + EventParam2;
                case "33":
                    return "On Damaged Target Between " + EventParam1 + "-" + EventParam2;
                case "34":
                    return "On Reached Point " + EventParam2;
                case "35":
                    return "On Summoned '<a href='http://wowhead.com/npc=" + EventParam1 + "'>" + getCreatureName(EventParam1) + "</a>' Despawned";
                case "36":
                    return "On Corpse Removed";
                case "37":
                    return "On AI Initialize";
                case "38":
                    return "On Data Set " + EventParam1 + " " + EventParam2;
                case "39":
                    return "On Waypoint " + EventParam1 + " Started";
                case "40":
                    return "On Waypoint " + EventParam1 + " Reached";
                case "41":
                    return "On Transport Player Added";
                case "42":
                    return "On Transport Creature Added";
                case "43":
                    return "On Transport Remove Player";
                case "44":
                    return "On Transport Relocate";
                case "45":
                    return "On Instance Player Enter";
                case "46":
                    return "On Trigger";
                case "47":
                    return "On Quest Accepted";
                case "48":
                    return "On Quest Objective Completed";
                case "49":
                    return "On Quest Completed";
                case "50":
                    return "On Quest Rewarded";
                case "51":
                    return "On Quest Failed";
                case "52":
                    return "On Text " + EventParam1 + " Over";
                case "53":
                    return "On Received Heal Between " + EventParam1 + "-" + EventParam2;
                case "54":
                    return "On Just Summoned";
                case "55":
                    return "On Waypoint " + EventParam1 + " Paused";
                case "56":
                    return "On Waypoint " + EventParam1 + " Resumed";
                case "57":
                    return "On Waypoint " + EventParam1 + " Stopped";
                case "58":
                    return "On Waypoint " + EventParam1 + " Ended";
                case "59":
                    return "On Timed Event " + EventParam1 + " Triggered";
                case "60":
                    return "On Update";
                case "61":
                    if (Lines[id].link == Lines[id].id) {
                        alert('Error\nLine ' + Lines[id].id + ': if you link the line to itself, the line will never be triggered!');
                        return "ERROR";
                    }
                    // Looking for the id that has the line id in its Link column
                    var Event = $('td:nth-child(2)').filter(function() { return $.text([this]) == id; }).closest('tr').find('td:first-child').text();
                    if (Event == "")
                        return "MISSING LINK";
                    return generateEventComment(Event);
                case "62":
                    return "On Gossip " + EventParam1 + (EventParam3 == 1 ? "" : " Option " + EventParam2) + " Selected";
                case "63":
                    return "On Just Created";
                case "64":
                    return "On Gossip Hello";
                case "65":
                    return "On Follow Complete";
                case "66":
                    return "On Dummy Effect";
                case "67":
                    return "On Behind Target";
                case "68":
                    return "On Game Event " + EventParam1 + " Started";
                case "69":
                    return "On Game Event " + EventParam1 + " Ended";
                case "70":
                    return "On GO State Changed";
                case "71":
                    return "On Event " + EventParam1 + " Inform";
                case "72":
                    return "On Action " + EventParam1 + " Done";
                case "73":
                    return "On Spellclick";
                case "74":
                    return "On Friendly Between " + EventParam1 + "-" + EventParam2 + "% HP";
                case "75":
                    return "On " + EventParam3 + "m To " + getCreatureName(EventParam2);
                case "76":
                    return "On " + EventParam3 + "m To " + getGOName(EventParam2);
                case "77":
                    return "On Counter Set " + EventParam1;
                case "100":
                    return "On Friendly Killed In " + EventParam1 + " Range";
                case "101":
                    if (EventParam2 == "0")
                        return "On Victim Not In LoS";
                    else if (EventParam2 == "1")
                        return "On Victim In LoS";
                    else {
                        alert("Error:\nLine " + id + ": 'Reverts' must be either 0 or 1.");
                        return "Error: Param2 is not 0 or 1.";
                    }
                case "102":
                    return "On Victim Died";
                case "103":
                    return "On Enter Phase " + EventParam1;
                case "104":
                    var Comment = "On GO State Loot ";
                    var Binary = "0x" + Hex(EventParam1);
                    Comment = generateBitComment('On GO State Loot ', Comment, Binary, 0x1, 'Not Ready');
                    Comment = generateBitComment('On GO State Loot ', Comment, Binary, 0x2, 'Ready');
                    Comment = generateBitComment('On GO State Loot ', Comment, Binary, 0x4, 'Activated');
                    Comment = generateBitComment('On GO State Loot ', Comment, Binary, 0x8, 'Just Deactivated');
                    return replaceComma(Comment);
                case "105":
                    var Comment = "On Affected By ";
                    var Binary = "0x" + Hex(EventParam2);
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x2, 'Charm');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x4, 'Disoriented');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x8, 'Disarm');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x10, 'Distract');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x20, 'Fear');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x40, 'Fumble');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x80, 'Root');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x100, 'Pacify');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x200, 'Silence');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x400, 'Sleep');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x800, 'Snare');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x1000, 'Stun');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x2000, 'Freeze');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x4000, 'Knockout');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x8000, 'Bleed');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x10000, 'Bandage');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x20000, 'Polymorph');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x40000, 'Banish');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x80000, 'Shield');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x100000, 'Shackle');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x200000, 'Mount');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x400000, 'Persuade');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x800000, 'Turn');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x1000000, 'Horror');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x2000000, 'Invulnerability');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x4000000, 'Interrupt');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x8000000, 'Daze');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x10000000, 'Discovery');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x20000000, 'Immune Shield');
                    Comment = generateBitComment('On Affected By ', Comment, Binary, 0x40000000, 'Sapped');
                    return replaceComma(Comment);
            }
        }
        function generateActionComment(id) {
            var ActionParam1 = Lines[id].action_param1;
            var ActionParam2 = Lines[id].action_param2;
            var ActionParam3 = Lines[id].action_param3;
            var ActionParam4 = Lines[id].action_param4;
            var ActionParam5 = Lines[id].action_param5;
            var ActionParam6 = Lines[id].action_param6;
            switch (Lines[id].action_type) {
                case "0":
                    return "No Action Type";
                    break;
                case "1":
                    return "Say Line " + ActionParam1;
                    break;
                case "2":
                    return "Set Faction " + ActionParam1;
                    break;
                case "3":
                    return "Morph To '" + ActionParam1 + "'";
                    break;
                case "4":
                    return "Play Sound " + ActionParam1;
                    break;
                case "5":
                    return "Play Emote " + ActionParam1;
                    break;
                case "6":
                    return "Fail Quest '<a href='http://wowhead.com/quest=" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "7":
                    return "Add Quest 'http://wowhead.com/quest=" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "8":
                    switch (ActionParam2) {
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
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0" && ActionParam6 != "0")
                        return "Play Random Emote (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "," + ActionParam4 + "," + ActionParam5 + "&" + ActionParam6 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0" && ActionParam6 == "0")
                        return "Play Random Emote (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "," + ActionParam4 + "&" + ActionParam5 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 == "0" && ActionParam6 == "0")
                        return "Play Random Emote (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "&" + ActionParam4 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0")
                        return "Play Random Emote (" + ActionParam1 + "," + ActionParam2 + "&" + ActionParam3 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0")
                        return "Play Random Emote (" + ActionParam1 + "&" + ActionParam2 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        alert("Error:\nLine " + id + ": 'Emote id 2' should not be 0.");
                        return "Error";
                    } else if (ActionParam1 == "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        alert("Error:\nLine " + id + ": 'Emote id 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "11":
                    return "Cast '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                    break;
                case "12":
                    return "Summon '<a href='http://wowhead.com/npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
                    break;
                case "13":
                    if (ActionParam1 != "0" && ActionParam2 == "0") {
                        return "Increase Target Threat By " + ActionParam1 + "%";
                    } else if (ActionParam1 == "0" && ActionParam2 != "0") {
                        return "Decrease Target Threat By " + ActionParam1 + "%";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "14":
                    if (ActionParam1 != "0" && ActionParam2 == "0")
                        return "Increase All Threat By " + ActionParam1 + "%";
                    else if (ActionParam1 == "0" && ActionParam2 != "0")
                        return "Decrease All Threat By " + ActionParam1 + "%";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "15":
                    return "Quest Credit ''<a href='http://wowhead.com/quest=" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "16":
                    return "Unused Action Type 16";
                    break;
                case "17":
                    return "Set Emote State " + ActionParam1;
                    break;
                case "18":
                case "19":
                    var Comment = (Lines[id].action_type == "18" ? "Set" : "Remove") + " Unit Flag";
                    var Binary = "0x" + Hex(ActionParam1);
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x1, 'Server Controlled');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x2, 'Non Attackable');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x4, 'Disable Move');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x8, 'PvP Attackable');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x10, 'Rename');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x20, 'Preparation');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x40, 'Unknown 6');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x80, 'Not Atackable 1');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x100, 'Immune to PC');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x200, 'Immune to NPC');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x400, 'Looting');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x800, 'Pet In Combat');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x1000, 'PvP');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x2000, 'Silenced');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x4000, 'Unkown 14');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x8000, 'Unknown 15');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x10000, 'Not PL Spell Target');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x20000, 'Pacified');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x40000, 'Stunned');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x80000, 'In Combat');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x100000, 'Taxi Flight');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x200000, 'Disarmed');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x400000, 'Confused');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x800000, 'Fleeing');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x1000000, 'Player Controlled');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x2000000, 'Not Selectable');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x4000000, 'Skinnable');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x8000000, 'Mount');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x10000000, 'Unknown 28');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x20000000, 'Unknown 29');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x40000000, 'Sheathe');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x80000000, 'Unknown 31');
                    return replaceComma(Comment);
                    break;
                case "20":
                    if (ActionParam1 == "0")
                        return "Stop Attacking";
                    else if (ActionParam1 == "1")
                        return "Start Attacking";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "21":
                    if (ActionParam1 == "0")
                        return "Disable Combat Movement";
                    else if (ActionParam1 == "1")
                        return "Enable Combat Movement";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "22":
                    return "Set Event Phase " + ActionParam1;
                    break;
                case "23":
                    if (ActionParam1 != "0" && ActionParam2 == "0")
                        return "Increase Phase By " + ActionParam1;
                    else if (ActionParam1 == "0" && ActionParam2 != "0")
                        return "Decrease Phase By " + ActionParam1;
                    else {
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
                    return "Quest Credit '<a href='http://wowhead.com/quest=" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "27":
                    return "Quest Credit '<a href='http://wowhead.com/quest=" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "28":
                    return "Remove Aura '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                    break;
                case "29":
                    return "Follow Target";
                    break;
                case "30":
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0" && ActionParam6 != "0")
                        return "Set Random Phase (" + ActionParam1 + ", " + ActionParam2 + ", " + ActionParam3 + ", " + ActionParam4 + ", " + ActionParam5 + " and " + ActionParam6 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0" && ActionParam6 == "0")
                        return "Set Random Phase (" + ActionParam1 + ", " + ActionParam2 + ", " + ActionParam3 + ", " + ActionParam4 + " and " + ActionParam5 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 == "0" && ActionParam6 == "0")
                        return "Set Random Phase (" + ActionParam1 + ", " + ActionParam2 + ", " + ActionParam3 + " and " + ActionParam4 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0")
                        return "Set Random Phase (" + ActionParam1 + ", " + ActionParam2 + " and " + ActionParam3 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0")
                        return "Set Random Phase (" + ActionParam1 + " and " + ActionParam2 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 2' should not be 0.");
                        return "Error";
                    } else if (ActionParam1 == "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "31":
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam1 != ActionParam2 && ActionParam2 > ActionParam1)
                        return "Set Phase Random Between " + ActionParam1 + "-" + ActionParam2;
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "32":
                    return "Reset GO";
                    break;
                case "33":
                    return "Quest Credit '<a href='http://wowhead.com/quest=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
                    break;
                case "34":
                    return "Set Instance " + (ActionParam3 == 1 ? "Boss State " : "Data ") + ActionParam1 + " " + ActionParam2;
                    break;
                case "35":
                    return "Set Instance Data " + ActionParam1 + " " + ActionParam2;
                    break;
                case "36":
                    return "Update Template To '<a href='http://wowhead.com/npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
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
                    switch (ActionParam1) {
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
                    if (ActionParam1 == "0")
                        return "Despawn Instant";
                    else if (ActionParam1 > "0")
                        return "Despawn In " + ActionParam1 + "ms";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "42":
                    if (ActionParam1 != "0" && ActionParam2 == "0")
                        return "Set Invincibility At " + ActionParam1 + " HP";
                    else if (ActionParam1 == "0" && ActionParam2 != "0")
                        return "Set Invincibility At " + ActionParam1 + "% HP";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "43":
                    if (ActionParam1 != "0" && ActionParam2 == "0")
                        return "Mount To Creature '<a href='http://wowhead.com/npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
                    else if (ActionParam1 == "0" && ActionParam2 != "0")
                        return "Mount To Model " + ActionParam1;
                    else if (ActionParam1 == "0" && ActionParam2 == "0")
                        return "Dismount";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "44":
                    return "Set Phase Mask " + ActionParam1;
                    break;
                case "45":
                    return "Set Data " + ActionParam1 + " " + ActionParam2;
                    break;
                case "46":
                    return "Move Forward " + ActionParam1 + " Yards";
                    break;
                case "47":
                    if (ActionParam1 == "0")
                        return "Set Visibility Off";
                    else if (ActionParam1 == "1")
                        return "Set Visibility On";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "48":
                    if (ActionParam1 == "0")
                        return "Set Active Off";
                    else if (ActionParam1 == "1")
                        return "Set Active On";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "49":
                    return "Start Attacking";
                    break;
                case "50":
                    return "Summon GO '<a href='http://wowhead.com/object=" + ActionParam1 + "'>" + getGOName(ActionParam1) + "</a>'";
                    break;
                case "51":
                    return "Kill Target";
                    break;
                case "52":
                    return "Activate Taxi Path " + ActionParam1;
                    break;
                case "53":
                    return "Start Waypoint " + ActionParam2;
                    break;
                case "54":
                    return "Pause Waypoint " + ActionParam1 + "ms";
                    break;
                case "55":
                    return "Stop Waypoint";
                    break;
                case "56":
                    return "Add Item '<a href='http://wowhead.com/item=" + ActionParam1 + "'>" + getItemName(ActionParam1) + "</a>' x" + ActionParam2;
                    break;
                case "57":
                    return "Remove Item '<a href='http://wowhead.com/item=" + ActionParam1 + "'>" + getItemName(ActionParam1) + "</a>' x" + ActionParam2;
                    break;
                case "58":
                    switch (ActionParam1) {
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
                        case "6":
                            return "Install Caster SUN Template";
                            break;
                        default:
                            return;
                    }
                    break;
                case "59":
                    if (ActionParam1 == "0")
                        return "Set Run Off";
                    else if (ActionParam1 == "1")
                        return "Set Run On";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "60":
                    if (ActionParam1 == "0")
                        return "Enable Gravity";
                    else if (ActionParam1 == "1")
                        return "Disable Gravity";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "61":
                    if (ActionParam1 == "0")
                        return "Set Swim Off";
                    else if (ActionParam1 == "1")
                        return "Set Swim On";
                    else {
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
                    return "Store Targetlist " + ActionParam1;
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
                    return "Play Movie " + ActionParam1;
                    break;
                case "69":
                    return "Move To Pos" + (ActionParam3 == 1 ? ' Pathfinding Disabled' : '');
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
                    return "Trigger Timed Event " + ActionParam1;
                    break;
                case "74":
                    return "Remove Timed Event " + ActionParam1;
                    break;
                case "75":
                    return "Add Aura '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                case "76":
                    return "Override Base Object Script";
                case "77":
                    return "Reset Base Object Script";
                case "78":
                    return "Reset All Scripts";
                case "79":
                    return "Set Ranged Movement";
                case "80":
                    return "Run Script <a href='/smartai/script/" + ActionParam1 + "'>" + ActionParam1 + "</a>";
                case "81":
                case "82":
                case "83":
                    Binary = "0x" + Hex(ActionParam1);
                    Comment = "Set NPC Flag ";
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x1, 'Gossip');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x2, 'Quest Giver');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x4, 'Unknown 1');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x8, 'Unknown 2');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x10, 'Trainer');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x20, 'Trainer Class');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x40, 'Trainer Profession');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x80, 'Vendor');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x100, 'Vendor Ammo');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x200, 'Vendor Food');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x400, 'Vendor Poison');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x800, 'Vendor Reagent');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x1000, 'Repair');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x2000, 'Flightmaster');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x4000, 'Spirit Healer');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x8000, 'Spirit Guide');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x10000, 'Innkeeper');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x20000, 'Banker');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x40000, 'Petitioner');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x80000, 'Tabard Designer');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x100000, 'Battle Master');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x200000, 'Auctioneer');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x400000, 'Stable Master');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x800000, 'Guild Banker');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x1000000, 'Spellclick');
                    Comment = generateBitComment('Set NPC Flag ', Comment, Binary, 0x4000000, 'Mailbox');
                    return replaceComma(Comment);
                case "84":
                    return "Say Line " + ActionParam1;
                case "85":
                    return "Self Cast '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                case "86":
                    return "Cross Cast '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                case "87":
                    return "Run Random Script";
                case "88":
                    return "Run Random Script Between " + ActionParam1 + " and " + ActionParam2;
                case "89":
                    return "Start Random Movement";
                case "90":
                case "91":
                    Binary = "0x" + Hex(ActionParam1);
                    Comment = "Set Flag ";
                    if (ActionParam2 == "0") {
                        switch (ActionParam1) {
                            case "0": return "Set Flag Stand Up"; break;
                            case "1": return "Set Flag Sit Down"; break;
                            case "2": return "Set Flag Sit Down Chair"; break;
                            case "3": return "Set Flag Sleep"; break;
                            case "4": return "Set Flag Sit Low Chair"; break;
                            case "5": return "Set Flag Sit Medium Chair"; break;
                            case "6": return "Set Flag Sit High Chair"; break;
                            case "7": return "Set Flag Dead"; break;
                            case "8": return "Set Flag Kneel"; break;
                            case "9": return "Set Flag Submerged"; break;
                            default: return;
                        }
                    }
                    if (ActionParam2 == "2") {
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x1, 'Unknown 1');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x2, 'Creep');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x4, 'Untrackable');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x8, 'Unknown 4');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x10, 'Unknown 5');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0xFF, 'All');
                        return replaceComma(Comment);
                    }
                    if (ActionParam2 == "3") {
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x1, 'Always Stand');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x2, 'Hover');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x4, 'Unknown 3');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0xFF, 'All');
                        return replaceComma(Comment);
                    }
                case "92":
                    return "Interrupt Spell '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                case "93":
                    return "Send Custom Animation " + ActionParam1;
                case "94":
                case "95":
                case "96":
                    Binary = "0x" + Hex(ActionParam1);
                    Comment = "Set Flag ";
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x1, 'Lootable');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x2, 'Track Unit');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x4, 'Tapped');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x8, 'Tapped By Player');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x10, 'Special Info');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x20, 'Dead');
                    return replaceComma(Comment);
                case "97":
                    return "Jump To Pos";
                case "98":
                    return "Send Gossip Menu " + ActionParam1;
                case "99":
                    switch (ActionParam1) {
                        case "0": return "Set Lootstate Not Ready"; break;
                        case "1": return "Set Lootstate Ready"; break;
                        case "2": return "Set Lootstate Activated";  break;
                        case "3": return "Set Lootstate Deactivated";  break;
                        default: return;
                    }
                case "100":
                    return "Send Target " + ActionParam1;
                case "101":
                    return "Set Home Position";
                case "102":
                    if (ActionParam1 == "0") {
                        return "Set Health Regeneration Off";
                    } else if (ActionParam1 == "1") {
                        return "Set Health Regeneration On";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                case "103":
                    if (ActionParam1 == "0")
                        return "Set Root Off";
                    else if (ActionParam1 == "1")
                        return "Set Root On";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
					}
                case "104":
                case "105":
                case "106":
                    Binary = "0x" + Hex(ActionParam1);
                    Comment = "Set Flag ";
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x1, 'In Use');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x2, 'Locked');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x4, 'Interact Cond');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x8, 'Transport');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x10, 'Not Selectable');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x20, 'No Despawn');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x40, 'Triggered');
                    Comment = generateBitComment('Set Flag ', Comment, Binary, 0x80, 'Vendor');
                    return replaceComma(Comment);
                case "107":
                    return "Summon Group " + ActionParam1;
                case "108":
                    switch (ActionParam1) {
                        case "0": return "Set Mana To " + ActionParam2; break;
                        case "1": return "Set Rage To " + ActionParam2; break;
                        case "2": return "Set Focus To " + ActionParam2; break;
                        case "3": return "Set Happiness To " + ActionParam2; break;
                        case "5": return "Set Health To " + ActionParam2; break;
                        default: return;
                    }
                case "109":
                    switch (ActionParam1) {
                        case "0": return "Add " + ActionParam2 + "Mana"; break;
                        case "1": return "Add " + ActionParam2 + "Rage"; break;
                        case "2": return "Add " + ActionParam2 + "Focus"; break;
                        case "3": return "Add " + ActionParam2 + "Happiness"; break;
                        case "5": return "Add " + ActionParam2 + "Health"; break;
                        default: return;
                    }
                case "110":
                    switch (ActionParam1) {
                        case "0": return "Remove " + ActionParam2 + "Mana"; break;
                        case "1": return "Remove " + ActionParam2 + "Rage"; break;
                        case "2": return "Remove " + ActionParam2 + "Focus"; break;
                        case "3": return "Remove " + ActionParam2 + "Happiness"; break;
                        case "5": return "Remove " + ActionParam2 + "Health"; break;
                        default: return;
                    }
                case "111":
                    return "Stop Game Event " + ActionParam1;
                case "112":
                    return "Start Game Event " + ActionParam1;
                case "113":
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0" && ActionParam6 != "0") {
                        return "Pick Closest Waypoint (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "," + ActionParam4 + "," + ActionParam5 + "&" + ActionParam6 + ")";
                    } else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0" && ActionParam6 == "0") {
                        return "Pick Closest Waypoint (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "," + ActionParam4 + "&" + ActionParam5 + ")";
                    } else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        return "Pick Closest Waypoint (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "&" + ActionParam4 + ")";
                    } else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        return "Pick Closest Waypoint (" + ActionParam1 + "," + ActionParam2 + "&" + ActionParam3 + ")";
                    } else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        return "Pick Closest Waypoint (" + ActionParam1 + "&" + ActionParam2 + ")";
                    } else if (ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 2' should not be 0.");
                        return "Error";
                    } else if (ActionParam1 == "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0" && ActionParam6 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                case "114":
                    return "Move Offset " + Lines[id].target_z;
                case "115":
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0")
                        return "Play Random Sound (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "," + ActionParam4 + "," + ActionParam5 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 != "0")
                      return "Play Random Sound (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "," + ActionParam4 + "&" + ActionParam5 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 != "0" && ActionParam5 == "0")
                      return "Play Random Sound (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + "&" + ActionParam4 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0" && ActionParam4 == "0" && ActionParam5 == "0")
                      return "Play Random Sound (" + ActionParam1 + "," + ActionParam2 + "&" + ActionParam3 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0")
                        return "Play Random Sound (" + ActionParam1 + "&" + ActionParam2 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0") {
                        alert("Error:\nLine " + id + ": 'Sound Id 2 should not be 0.");
                        return "Error";
                    } else if (ActionParam1 == "0" && ActionParam2 == "0" && ActionParam3 == "0" && ActionParam4 == "0" && ActionParam5 == "0") {
                        alert("Error:\nLine " + id + ": 'Sound Id 1 & 2 should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                case "116":
                    return "Delay Corpse " + ActionParam1 + "ms";
                case "117":
                    return (ActionParam1 == 1 ? "Disable Evade" : "Enable Evade");
                case "118":
                    switch(ActionParam1)
                    {
                        case 0: return "Set GO State Active"; break;
                        case 1: return "Set GO Ready"; break;
                        case 2: return "Set GO Active Alternative"; break;
                        default: alert("Error:\nLine " + id + ": something is wrong."); return "Error";
                    }
                    break;
                case "119":
                    if (ActionParam1 == "0")
                      return "Set Fly Off";
                    else if (ActionParam1 == "1")
                      return "Set Fly On";
                    else {
                      alert("Error:\nLine " + id + ": something is wrong.");
                      return "Error";
                    }
                    break;
                case "120":
                  var Comment = "Remove Auras of Type ";
                  switch(ActionParam1)
                  {
                    case "0": return Comment + "NONE"; break;
                    case "1": return Comment + "BIND_SIGHT"; break;
                    case "2": return Comment + "MOD_POSSESS"; break;
                    case "3": return Comment + "PERIODIC_DAMAGE"; break;
                    case "4": return Comment + "DUMMY"; break;
                    case "5": return Comment + "MOD_CONFUSE"; break;
                    case "6": return Comment + "MOD_CHARM"; break;
                    case "7": return Comment + "MOD_FEAR"; break;
                    case "8": return Comment + "PERIODIC_HEAL"; break;
                    case "9": return Comment + "MOD_ATTACKSPEED"; break;
                    case "10": return Comment + "MOD_THREAT"; break;
                    case "11": return Comment + "MOD_TAUNT"; break;
                    case "12": return Comment + "MOD_STUN"; break;
                    case "13": return Comment + "MOD_DAMAGE_DONE"; break;
                    case "14": return Comment + "MOD_DAMAGE_TAKEN"; break;
                    case "15": return Comment + "DAMAGE_SHIELD"; break;
                    case "16": return Comment + "MOD_STEALTH"; break;
                    case "17": return Comment + "MOD_DETECT"; break;
                    case "18": return Comment + "MOD_INVISIBILITY"; break;
                    case "19": return Comment + "MOD_INVISIBILITY_DETECTION"; break;
                    case "20": return Comment + "OBS_MOD_HEALTH"; break;
                    case "21": return Comment + "OBS_MOD_POWER"; break;
                    case "22": return Comment + "MOD_RESISTANCE"; break;
                    case "23": return Comment + "PERIODIC_TRIGGER_SPELL"; break;
                    case "24": return Comment + "PERIODIC_ENERGIZE"; break;
                    case "25": return Comment + "MOD_PACIFY"; break;
                    case "26": return Comment + "MOD_ROOT"; break;
                    case "27": return Comment + "MOD_SILENCE"; break;
                    case "28": return Comment + "REFLECT_SPELLS"; break;
                    case "29": return Comment + "MOD_STAT"; break;
                    case "30": return Comment + "MOD_SKILL"; break;
                    case "31": return Comment + "MOD_INCREASE_SPEED"; break;
                    case "32": return Comment + "MOD_INCREASE_MOUNTED_SPEED"; break;
                    case "33": return Comment + "MOD_DECREASE_SPEED"; break;
                    case "34": return Comment + "MOD_INCREASE_HEALTH"; break;
                    case "35": return Comment + "MOD_INCREASE_ENERGY"; break;
                    case "36": return Comment + "MOD_SHAPESHIFT"; break;
                    case "37": return Comment + "EFFECT_IMMUNITY"; break;
                    case "38": return Comment + "STATE_IMMUNITY"; break;
                    case "39": return Comment + "SCHOOL_IMMUNITY"; break;
                    case "40": return Comment + "DAMAGE_IMMUNITY"; break;
                    case "41": return Comment + "DISPEL_IMMUNITY"; break;
                    case "42": return Comment + "PROC_TRIGGER_SPELL"; break;
                    case "43": return Comment + "PROC_TRIGGER_DAMAGE"; break;
                    case "44": return Comment + "TRACK_CREATURES"; break;
                    case "45": return Comment + "TRACK_RESOURCES"; break;
                    case "46": return Comment + "MOD_PARRY_SKILL"; break;
                    case "47": return Comment + "MOD_PARRY_PERCENT"; break;
                    case "48": return Comment + "MOD_DODGE_SKILL"; break;
                    case "49": return Comment + "MOD_DODGE_PERCENT"; break;
                    case "50": return Comment + "MOD_BLOCK_SKILL"; break;
                    case "51": return Comment + "MOD_BLOCK_PERCENT"; break;
                    case "52": return Comment + "MOD_CRIT_PERCENT"; break;
                    case "53": return Comment + "PERIODIC_LEECH"; break;
                    case "54": return Comment + "MOD_HIT_CHANCE"; break;
                    case "55": return Comment + "MOD_SPELL_HIT_CHANCE"; break;
                    case "56": return Comment + "TRANSFORM"; break;
                    case "57": return Comment + "MOD_SPELL_CRIT_CHANCE"; break;
                    case "58": return Comment + "MOD_INCREASE_SWIM_SPEED"; break;
                    case "59": return Comment + "MOD_DAMAGE_DONE_CREATURE"; break;
                    case "60": return Comment + "MOD_PACIFY_SILENCE"; break;
                    case "61": return Comment + "MOD_SCALE"; break;
                    case "62": return Comment + "PERIODIC_HEALTH_FUNNEL"; break;
                    case "63": return Comment + "PERIODIC_MANA_FUNNEL"; break;
                    case "64": return Comment + "PERIODIC_MANA_LEECH"; break;
                    case "65": return Comment + "MOD_CASTING_SPEED"; break;
                    case "66": return Comment + "FEIGN_DEATH"; break;
                    case "67": return Comment + "MOD_DISARM"; break;
                    case "68": return Comment + "MOD_STALKED"; break;
                    case "69": return Comment + "SCHOOL_ABSORB"; break;
                    case "70": return Comment + "EXTRA_ATTACKS"; break;
                    case "71": return Comment + "MOD_SPELL_CRIT_CHANCE_SCHOOL"; break;
                    case "72": return Comment + "MOD_POWER_COST_SCHOOL_PCT"; break;
                    case "73": return Comment + "MOD_POWER_COST_SCHOOL"; break;
                    case "74": return Comment + "REFLECT_SPELLS_SCHOOL"; break;
                    case "75": return Comment + "MOD_LANGUAGE"; break;
                    case "76": return Comment + "FAR_SIGHT"; break;
                    case "77": return Comment + "MECHANIC_IMMUNITY"; break;
                    case "78": return Comment + "MOUNTED"; break;
                    case "79": return Comment + "MOD_DAMAGE_PERCENT_DONE"; break;
                    case "80": return Comment + "MOD_PERCENT_STAT"; break;
                    case "81": return Comment + "SPLIT_DAMAGE_PCT"; break;
                    case "82": return Comment + "WATER_BREATHING"; break;
                    case "83": return Comment + "MOD_BASE_RESISTANCE"; break;
                    case "84": return Comment + "MOD_REGEN"; break;
                    case "85": return Comment + "MOD_POWER_REGEN"; break;
                    case "86": return Comment + "CHANNEL_DEATH_ITEM"; break;
                    case "87": return Comment + "MOD_DAMAGE_PERCENT_TAKEN"; break;
                    case "88": return Comment + "MOD_HEALTH_REGEN_PERCENT"; break;
                    case "89": return Comment + "PERIODIC_DAMAGE_PERCENT"; break;
                    case "90": return Comment + "MOD_RESIST_CHANCE"; break;
                    case "91": return Comment + "MOD_DETECT_RANGE"; break;
                    case "92": return Comment + "PREVENTS_FLEEING"; break;
                    case "93": return Comment + "MOD_UNATTACKABLE"; break;
                    case "94": return Comment + "INTERRUPT_REGEN"; break;
                    case "95": return Comment + "GHOST"; break;
                    case "96": return Comment + "SPELL_MAGNET"; break;
                    case "97": return Comment + "MANA_SHIELD"; break;
                    case "98": return Comment + "MOD_SKILL_TALENT"; break;
                    case "99": return Comment + "MOD_ATTACK_POWER"; break;
                    case "100": return Comment + "AURAS_VISIBLE"; break;
                    case "101": return Comment + "MOD_RESISTANCE_PCT"; break;
                    case "102": return Comment + "MOD_MELEE_ATTACK_POWER_VERSUS"; break;
                    case "103": return Comment + "MOD_TOTAL_THREAT"; break;
                    case "104": return Comment + "WATER_WALK"; break;
                    case "105": return Comment + "FEATHER_FALL"; break;
                    case "106": return Comment + "HOVER"; break;
                    case "107": return Comment + "ADD_FLAT_MODIFIER"; break;
                    case "108": return Comment + "ADD_PCT_MODIFIER"; break;
                    case "109": return Comment + "ADD_TARGET_TRIGGER"; break;
                    case "110": return Comment + "MOD_POWER_REGEN_PERCENT"; break;
                    case "111": return Comment + "ADD_CASTER_HIT_TRIGGER"; break;
                    case "112": return Comment + "OVERRIDE_CLASS_SCRIPTS"; break;
                    case "113": return Comment + "MOD_RANGED_DAMAGE_TAKEN"; break;
                    case "114": return Comment + "MOD_RANGED_DAMAGE_TAKEN_PCT"; break;
                    case "115": return Comment + "MOD_HEALING"; break;
                    case "116": return Comment + "MOD_REGEN_DURING_COMBAT"; break;
                    case "117": return Comment + "MOD_MECHANIC_RESISTANCE"; break;
                    case "118": return Comment + "MOD_HEALING_PCT"; break;
                    case "119": return Comment + "SHARE_PET_TRACKING"; break;
                    case "120": return Comment + "UNTRACKABLE"; break;
                    case "121": return Comment + "EMPATHY"; break;
                    case "122": return Comment + "MOD_OFFHAND_DAMAGE_PCT"; break;
                    case "123": return Comment + "MOD_TARGET_RESISTANCE"; break;
                    case "124": return Comment + "MOD_RANGED_ATTACK_POWER"; break;
                    case "125": return Comment + "MOD_MELEE_DAMAGE_TAKEN"; break;
                    case "126": return Comment + "MOD_MELEE_DAMAGE_TAKEN_PCT"; break;
                    case "127": return Comment + "RANGED_ATTACK_POWER_ATTACKER_BONUS"; break;
                    case "128": return Comment + "MOD_POSSESS_PET"; break;
                    case "129": return Comment + "MOD_SPEED_ALWAYS"; break;
                    case "130": return Comment + "MOD_MOUNTED_SPEED_ALWAYS"; break;
                    case "131": return Comment + "MOD_RANGED_ATTACK_POWER_VERSUS"; break;
                    case "132": return Comment + "MOD_INCREASE_ENERGY_PERCENT"; break;
                    case "133": return Comment + "MOD_INCREASE_HEALTH_PERCENT"; break;
                    case "134": return Comment + "MOD_MANA_REGEN_INTERRUPT"; break;
                    case "135": return Comment + "MOD_HEALING_DONE"; break;
                    case "136": return Comment + "MOD_HEALING_DONE_PERCENT"; break;
                    case "137": return Comment + "MOD_TOTAL_STAT_PERCENTAGE"; break;
                    case "138": return Comment + "MOD_HASTE"; break;
                    case "139": return Comment + "FORCE_REACTION"; break;
                    case "140": return Comment + "MOD_RANGED_HASTE"; break;
                    case "141": return Comment + "MOD_RANGED_AMMO_HASTE"; break;
                    case "142": return Comment + "MOD_BASE_RESISTANCE_PCT"; break;
                    case "143": return Comment + "MOD_RESISTANCE_EXCLUSIVE"; break;
                    case "144": return Comment + "SAFE_FALL"; break;
                    case "145": return Comment + "CHARISMA"; break;
                    case "146": return Comment + "PERSUADED"; break;
                    case "147": return Comment + "MECHANIC_IMMUNITY_MASK"; break;
                    case "148": return Comment + "RETAIN_COMBO_POINTS"; break;
                    case "149": return Comment + "RESIST_PUSHBACK"; break;
                    case "150": return Comment + "MOD_SHIELD_BLOCKVALUE_PCT"; break;
                    case "151": return Comment + "TRACK_STEALTHED"; break;
                    case "152": return Comment + "MOD_DETECTED_RANGE"; break;
                    case "153": return Comment + "SPLIT_DAMAGE_FLAT"; break;
                    case "154": return Comment + "MOD_STEALTH_LEVEL"; break;
                    case "155": return Comment + "MOD_WATER_BREATHING"; break;
                    case "156": return Comment + "MOD_REPUTATION_GAIN"; break;
                    case "157": return Comment + "PET_DAMAGE_MULTI"; break;
                    case "158": return Comment + "MOD_SHIELD_BLOCKVALUE"; break;
                    case "159": return Comment + "NO_PVP_CREDIT"; break;
                    case "160": return Comment + "MOD_AOE_AVOIDANCE"; break;
                    case "161": return Comment + "MOD_HEALTH_REGEN_IN_COMBAT"; break;
                    case "162": return Comment + "POWER_BURN_MANA"; break;
                    case "163": return Comment + "MOD_CRIT_DAMAGE_BONUS_MELEE"; break;
                    case "164": return Comment + "164"; break;
                    case "165": return Comment + "MELEE_ATTACK_POWER_ATTACKER_BONUS"; break;
                    case "166": return Comment + "MOD_ATTACK_POWER_PCT"; break;
                    case "167": return Comment + "MOD_RANGED_ATTACK_POWER_PCT"; break;
                    case "168": return Comment + "MOD_DAMAGE_DONE_VERSUS"; break;
                    case "169": return Comment + "MOD_CRIT_PERCENT_VERSUS"; break;
                    case "170": return Comment + "DETECT_AMORE"; break;
                    case "171": return Comment + "MOD_SPEED_NOT_STACK"; break;
                    case "172": return Comment + "MOD_MOUNTED_SPEED_NOT_STACK"; break;
                    case "173": return Comment + "ALLOW_CHAMPION_SPELLS"; break;
                    case "174": return Comment + "MOD_SPELL_DAMAGE_OF_STAT_PERCENT"; break;
                    case "175": return Comment + "MOD_SPELL_HEALING_OF_STAT_PERCENT"; break;
                    case "176": return Comment + "SPIRIT_OF_REDEMPTION"; break;
                    case "177": return Comment + "AOE_CHARM"; break;
                    case "178": return Comment + "MOD_DEBUFF_RESISTANCE"; break;
                    case "179": return Comment + "MOD_ATTACKER_SPELL_CRIT_CHANCE"; break;
                    case "180": return Comment + "MOD_FLAT_SPELL_DAMAGE_VERSUS"; break;
                    case "181": return Comment + "MOD_FLAT_SPELL_CRIT_DAMAGE_VERSUS"; break;
                    case "182": return Comment + "MOD_RESISTANCE_OF_STAT_PERCENT"; break;
                    case "183": return Comment + "MOD_CRITICAL_THREAT"; break;
                    case "184": return Comment + "MOD_ATTACKER_MELEE_HIT_CHANCE"; break;
                    case "185": return Comment + "MOD_ATTACKER_RANGED_HIT_CHANCE"; break;
                    case "186": return Comment + "MOD_ATTACKER_SPELL_HIT_CHANCE"; break;
                    case "187": return Comment + "MOD_ATTACKER_MELEE_CRIT_CHANCE"; break;
                    case "188": return Comment + "MOD_ATTACKER_RANGED_CRIT_CHANCE"; break;
                    case "189": return Comment + "MOD_RATING"; break;
                    case "190": return Comment + "MOD_FACTION_REPUTATION_GAIN"; break;
                    case "191": return Comment + "USE_NORMAL_MOVEMENT_SPEED"; break;
                    case "192": return Comment + "HASTE_MELEE"; break;
                    case "193": return Comment + "MELEE_SLOW"; break;
                    case "194": return Comment + "MOD_DEPRICATED_1"; break;
                    case "195": return Comment + "MOD_DEPRICATED_2"; break;
                    case "196": return Comment + "MOD_COOLDOWN"; break;
                    case "197": return Comment + "MOD_ATTACKER_SPELL_AND_WEAPON_CRIT_CHANCE"; break;
                    case "198": return Comment + "MOD_ALL_WEAPON_SKILLS"; break;
                    case "199": return Comment + "MOD_INCREASES_SPELL_PCT_TO_HIT"; break;
                    case "200": return Comment + "MOD_XP_PCT"; break;
                    case "201": return Comment + "FLY"; break;
                    case "202": return Comment + "IGNORE_COMBAT_RESULT"; break;
                    case "203": return Comment + "MOD_ATTACKER_MELEE_CRIT_DAMAGE"; break;
                    case "204": return Comment + "MOD_ATTACKER_RANGED_CRIT_DAMAGE"; break;
                    case "205": return Comment + "205"; break;
                    case "206": return Comment + "MOD_INCREASE_VEHICLE_FLIGHT_SPEED"; break;
                    case "207": return Comment + "MOD_INCREASE_MOUNTED_FLIGHT_SPEED"; break;
                    case "208": return Comment + "MOD_INCREASE_FLIGHT_SPEED"; break;
                    case "209": return Comment + "MOD_MOUNTED_FLIGHT_SPEED_ALWAYS"; break;
                    case "210": return Comment + "210"; break;
                    case "211": return Comment + "MOD_FLIGHT_SPEED_NOT_STACK"; break;
                    case "212": return Comment + "MOD_RANGED_ATTACK_POWER_OF_STAT_PERCENT"; break;
                    case "213": return Comment + "MOD_RAGE_FROM_DAMAGE_DEALT"; break;
                    case "214": return Comment + "214"; break;
                    case "215": return Comment + "ARENA_PREPARATION"; break;
                    case "216": return Comment + "HASTE_SPELLS"; break;
                    case "217": return Comment + "217"; break;
                    case "218": return Comment + "HASTE_RANGED"; break;
                    case "219": return Comment + "MOD_MANA_REGEN_FROM_STAT"; break;
                    case "220": return Comment + "MOD_RATING_FROM_STAT"; break;
                    case "221": return Comment + "IGNORED"; break;
                    case "222": return Comment + "222"; break;
                    case "223": return Comment + "223"; break;
                    case "224": return Comment + "224"; break;
                    case "225": return Comment + "PRAYER_OF_MENDING"; break;
                    case "226": return Comment + "PERIODIC_DUMMY"; break;
                    case "227": return Comment + "PERIODIC_TRIGGER_SPELL_WITH_VALUE"; break;
                    case "228": return Comment + "DETECT_STEALTH"; break;
                    case "229": return Comment + "MOD_AOE_DAMAGE_AVOIDANCE"; break;
                    case "230": return Comment + "230"; break;
                    case "231": return Comment + "231"; break;
                    case "232": return Comment + "MECHANIC_DURATION_MOD"; break;
                    case "233": return Comment + "233"; break;
                    case "234": return Comment + "MECHANIC_DURATION_MOD_NOT_STACK"; break;
                    case "235": return Comment + "MOD_DISPEL_RESIST"; break;
                    case "236": return Comment + "236"; break;
                    case "237": return Comment + "MOD_SPELL_DAMAGE_OF_ATTACK_POWER"; break;
                    case "238": return Comment + "MOD_SPELL_HEALING_OF_ATTACK_POWER"; break;
                    case "239": return Comment + "MOD_SCALE_2"; break;
                    case "240": return Comment + "MOD_EXPERTISE"; break;
                    case "241": return Comment + "FORCE_MOVE_FORWARD"; break;
                    case "242": return Comment + "MOD_SPELL_DAMAGE_FROM_HEALING"; break;
                    case "243": return Comment + "243"; break;
                    case "244": return Comment + "COMPREHEND_LANGUAGE"; break;
                    case "245": return Comment + "MOD_DURATION_OF_MAGIC_EFFECTS"; break;
                    case "246": return Comment + "246"; break;
                    case "247": return Comment + "CLONE_CASTER"; break;
                    case "248": return Comment + "MOD_COMBAT_RESULT_CHANCE"; break;
                    case "249": return Comment + "249"; break;
                    case "250": return Comment + "MOD_INCREASE_HEALTH_2"; break;
                    case "251": return Comment + "MOD_ENEMY_DODGE"; break;
                    case "252": return Comment + "252"; break;
                    case "253": return Comment + "253"; break;
                    case "254": return Comment + "254"; break;
                    case "255": return Comment + "255"; break;
                    case "256": return Comment + "256"; break;
                    case "257": return Comment + "257"; break;
                    case "258": return Comment + "258"; break;
                    case "259": return Comment + "APPLY_IMMUNITY_ID"; break;
                    case "260": return Comment + "APPLY_EXTRA_FLAG"; break;
                    default: return "Error";
                  }
                  return Comment;
                case "121":
                  return "Set Sight Dist To " + ActionParam1 + "m";
                case "122":
                  return "Flee For " + ActionParam1 + "ms";
                case "123":
                  return "Add " + (ActionParam1 - ActionParam2) + " Threat";
                case "124":
                  return "Load Equipment #" + ActionParam1;
                case "125":
                  return "Run SMART_EVENT Ids Between " + ActionParam1 + " and " + ActionParam2;
                case "126":
                  return "Remove All Owned GameObjects";
                case "127":
                  return "Set " + (ActionParam1 == 1 ? "Stop Moving" : "Allow Moving") + " And " + (ActionParam2 == 1 ? "Movement Expired" : "Movement OK");
				case "134":
				  return "Invoker Cast '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                case "150":
                case "151":
                    Binary = "0x" + Hex(ActionParam1);
                    Comment = "Set Flag ";
                    if (ActionParam2 == "0") {
                        switch (ActionParam1) {
                            case "0": return "Set Sheathe Unarmed"; break;
                            case "1": return "Set Sheathe Melee"; break;
                            case "2": return "Set Sheathe Ranged"; break;
                            default: return;
                        }
                    }
                    if (ActionParam2 == "1") {
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x1, 'Unknown 1');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x2, 'Unknown 2');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x4, 'Sanctuary');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x8, 'Auras');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x10, 'Unknown 5');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x20, 'Unknown 6');
                        Comment = generateBitComment('Set Flag ', Comment, Binary, 0x40, 'Unknown 7');
                    }
                    return replaceComma(Comment);
                case "152":
                    return "Load Path " + ActionParam1;
                case "153":
                    return "Teleport Target On Self";
                case "154":
                    return "Teleport On Target";
                case "155":
                    return "Assist Target";
                case "156":
                    if(ActionParam1 == "0")
                        return "Can Move Home";
                    else if(ActionParam1 == "1")
                        return "Prevent Moving Home";
                    else
                        alert('Error in line '+id+':\nAction Param 1 requires either 0 or 1.');
                    break;
                case "157":
                    return "Add Target To Formation";
                case "158":
                    return "Remove Target From Formation";
                case "159":
                    return "Remove The Formation";
                case "160":
                    var Com = (ActionParam2 == 1 ? "Apply " : "Remove ") + "Immune";
                    switch (ActionParam1) {
                        case "2": return Com += "Charm"; break;
                        case "4": return Com += "Disoriented"; break;
                        case "8": return Com += "Disarm"; break;
                        case "16": return Com += "Distrat"; break;
                        case "32": return Com += "Fear"; break;
                        case "64": return Com += "Fumble"; break;
                        case "128": return Com += "Root"; break;
                        case "256": return Com += "Pacify"; break;
                        case "512": return Com += "Silence"; break;
                        case "1024": return Com += "Sleep"; break;
                        case "2048": return Com += "Snare"; break;
                        case "4096": return Com += "Stun"; break;
                        case "8192": return Com += "Freeze"; break;
                        case "16384": return Com += "Knockout"; break;
                        case "32768": return Com += "Bleed"; break;
                        case "65536": return Com += "Bandage"; break;
                        case "131072": return Com += "Polymorph"; break;
                        case "262144": return Com += "Banish"; break;
                        case "524288": return Com += "Shield"; break;
                        case "1048576": return Com += "Shackle"; break;
                        case "2097152": return Com += "Mount"; break;
                        case "4194304": return Com += "Persuade"; break;
                        case "8388608": return Com += "Turn"; break;
                        case "16777216": return Com += "Horror"; break;
                        case "33554432": return Com += "Invulnerability"; break;
                        case "67108864": return Com += "Interrupt"; break;
                        case "134217728": return Com += "Daze"; break;
                        case "268435456": return Com += "Discovery"; break;
                        case "536870912": return Com += "Immune Shield"; break;
                        case "1073741824": return Com += "Sapped"; break;
                        default: return 'Error';
                    }
                case "161":
                    return (ActionParam2 > 0 ? "Apply " : "Remove ") + getSpellName(ActionParam1);
                case "162":
                    return "DO NOT USE";
                case "163":
                    return "Store Current Phase";
                case "164":
                    return "Restore Phase";
				case "165":
					return (ActionParam1 > 0 ? "Allow" : "Disallow") + " despawning summons";
				case "166":
                    return "Remove owned aura '<a href='http://wowhead.com/spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                default:
                    return "Error in generateActionComment";
            }
        }
        function duplicateLine(id) {
            MaxID++;

            var BG = $('table > tbody > tr:has(td:first-child:contains("' + id + '"))').css('background-color');
            if (BG.length == 0 || BG == "rgb(245, 245, 245)")
                BG = "";
            else
                BG = 'style="background-color: ' + BG + ';"';
            
            $('<tr ' + BG + '>' +
            '<td><strong>' + MaxID + '</strong></td>' +
            '<td>' + Lines[id].link + '</td>' +
            '<td>' + Events[Lines[id].event_type].name.slice(6) + '</td>' +
            '<td>' + Actions[Lines[id].action_type].name.slice(7) + '</td>' +
            '<td>' + Targets[Lines[id].target_type].name.slice(7) + '</td>' +
            '<td>' + Lines[id].comment + '</td>' +
            '<td>' + Lines[id].patch_min + '</td>' +
            '<td class="options">' +
            '   <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' +
            '   <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</td>' +
            '</tr>').appendTo('table > tbody');
            Lines[MaxID] = {
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
                "target_o": Lines[id].target_o,
				"patch_min": Lines[id].patch_min,
				"patch_max": Lines[id].patch_max
            };
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
            '<td>' + Patch + '</td>' +
            '<td class="options">' +
            '   <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' +
            '   <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</td>' +
            '</tr>').appendTo('table > tbody');
            Lines[MaxID] = {
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
                "target_o": "0",
                "patch_min": "0",
                "patch_max": "10"
            };
            displayLine(MaxID, 'table > tbody > tr:has(td:first-child:contains("' + MaxID + '"))');
            RefreshTable();
        }
        function deleteLine(id) {
            $('tr td:first-child').filter(function(){
                return $.trim($(this).text()) === id;
            }).parent().remove();
            delete Lines[id];
            MaxID = getMaxID(Lines);   // Redefine MaxID to match the changes done to Lines

            displayLine(0, 'table > tbody > tr:has(td:first-child:contains(0))');
            RefreshTable();
        }
        function displayLine(id, line) {
            $(line).closest('tr').addClass('active info').siblings('tr').removeClass('active info');
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

            var SelectFlags = '#event_flags_value';
            var SelectPhase = '#event_phase_mask_value';
            var SelectTargetFlags = '#target_flags_value';

            if (Lines[id].event_flags != "0") {
                var Binary = "0x" + Hex(Lines[id].event_flags);
                selectByte(SelectFlags, 0x1, Binary, 1);
                selectByte(SelectFlags, 0x2, Binary, 2);
                selectByte(SelectFlags, 0x4, Binary, 3);
                selectByte(SelectFlags, 0x8, Binary, 4);
                selectByte(SelectFlags, 0x10, Binary, 5);
                selectByte(SelectFlags, 0x80, Binary, 6);
                selectByte(SelectFlags, 0x100, Binary, 7);
                selectByte(SelectFlags, 0x200, Binary, 8);
            } else {
                $(SelectFlags + ' > option').removeAttr('selected');
            }
            if (Lines[id].event_phase_mask != "0") {
                Binary = "0x" + Hex(Lines[id].event_phase_mask);
                selectByte(SelectPhase, 0x1, Binary, 1);
                selectByte(SelectPhase, 0x2, Binary, 2);
                selectByte(SelectPhase, 0x4, Binary, 3);
                selectByte(SelectPhase, 0x8, Binary, 4);
                selectByte(SelectPhase, 0x10, Binary, 5);
                selectByte(SelectPhase, 0x20, Binary, 6);
                selectByte(SelectPhase, 0x40, Binary, 7);
                selectByte(SelectPhase, 0x80, Binary, 8);
                selectByte(SelectPhase, 0x100, Binary, 9);
            } else {
                $(SelectPhase + ' > option').removeAttr('selected');
            }
            if (Lines[id].target_flags != "0") {
                Binary = "0x" + Hex(Lines[id].target_flags);
                selectByte(SelectTargetFlags, 0x1, Binary, 1);
                selectByte(SelectTargetFlags, 0x2, Binary, 2);
                selectByte(SelectTargetFlags, 0x4, Binary, 3);
                selectByte(SelectTargetFlags, 0x8, Binary, 4);
                selectByte(SelectTargetFlags, 0x10, Binary, 5);
            } else {
                $(SelectTargetFlags + ' > option').removeAttr('selected');
            }
            $(SelectPhase).trigger('chosen:updated');
            $(SelectFlags).trigger('chosen:updated');
            $(SelectTargetFlags).trigger('chosen:updated');
            EventType.val(Lines[id].event_type).trigger('chosen:updated');
            ActionType.val(Lines[id].action_type).trigger('chosen:updated');
            TargetType.val(Lines[id].target_type).trigger('chosen:updated');
        }

        function displayEventVal(EventType, id) {
            switch (EventType) {
                case "5":
                case "62":
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
                case "29":
                case "119":
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
                case "22":
                    EventParam1DIV.empty();
                    $(getReceiveEmoteSelect('event', 1)).appendTo(EventParam1DIV);
                    $('#event_param1_val').val(Lines[id].event_param1);
                    displayEventValDefault(2, id);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
				case "64":
                    EventParam1DIV.empty();
                    $(getHelloFilter('event', 1)).appendTo(EventParam1DIV);
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
                    '   <option value="4">Confused</option>' +
                    '   <option value="5">Chase</option>' +
                    '   <option value="6">Home</option>' +
                    '   <option value="7">Flight</option>' +
                    '   <option value="8">Point</option>' +
                    '   <option value="9">Fleeing</option>' +
                    '   <option value="10">Distract</option>' +
                    '   <option value="11">Assistance</option>' +
                    '   <option value="12">Assistance Distract</option>' +
                    '   <option value="13">Timed Fleeing</option>' +
                    '   <option value="14">Follow</option>' +
                    '   <option value="15">Rotate</option>' +
                    '   <option value="16">Effect</option>' +
                    '   <option value="17">TC Spline Chain</option>' +
                    '   <option value="18">Formation</option>' +
                    '   <option value="19">Fall</option>' +
                    '   <option value="20">Charge</option>' +
                    '</select>').appendTo(EventParam1DIV);
                    $('#event_param1_val').val(Lines[id].event_param1);
                    displayEventValDefault(2, id);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                case "70":
                    EventParam1DIV.empty();
                    $('<select class="form-control" id="event_param1_val">' +
                    '   <option value="0">ACTIVE</option>' +
                    '   <option value="1">READY (DEFAULT)</option>' +
                    '   <option value="2">ACTIVE ALTERNATIVE (SPECIFIC)</option>' +
                    '</select>').appendTo(EventParam1DIV);
                    $('#event_param1_val').val(Lines[id].event_param1);
                    displayEventValDefault(2, id);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                case "104":
                    EventParam1DIV.empty();
                    $('<select multiple class="form-control spell_flags" id="event_param1_val">' +
                    '   <option value="1">NOT READY</option>' +
                    '   <option value="2">READY</option>' +
                    '   <option value="4">ACTIVATED</option>' +
                    '   <option value="8">JUST_DEACTIVATED</option>' +
                    '</select>').appendTo(EventParam1DIV);
                    $('#event_param1_val').val(Lines[id].event_param1);
                    var NPCFlags = '#event_param1_val';
                    var Binary = "0x" + Hex(Lines[id].event_param1);
                    selectByte(NPCFlags, 0x1, Binary, 1);
                    selectByte(NPCFlags, 0x2, Binary, 2);
                    selectByte(NPCFlags, 0x4, Binary, 3);
                    selectByte(NPCFlags, 0x8, Binary, 4);
                    displayEventValDefault(2, id);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                case "105":
                    displayEventValDefault(1, id);
                    EventParam2DIV.empty();
                    $('<select multiple class="form-control spell_flags" id="event_param2_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="2">CHARM</option>' +
                        '   <option value="4">DISORIENTED</option>' +
                        '   <option value="8">DISARM</option>' +
                        '   <option value="16">DISTRACT</option>' +
                        '   <option value="32">FEAR</option>' +
                        '   <option value="64">FUMBLE</option>' +
                        '   <option value="128">ROOT</option>' +
                        '   <option value="256">PACIFY</option>' +
                        '   <option value="512">SILENCE</option>' +
                        '   <option value="1024">SLEEP</option>' +
                        '   <option value="2048">SNARE</option>' +
                        '   <option value="4096">STUN</option>' +
                        '   <option value="8192">FREEZE</option>' +
                        '   <option value="16384">KNOCKOUT</option>' +
                        '   <option value="32768">BLEED</option>' +
                        '   <option value="65536">BANDAGE</option>' +
                        '   <option value="131072">POLYMORPH</option>' +
                        '   <option value="262144">BANISH</option>' +
                        '   <option value="524288">SHIELD</option>' +
                        '   <option value="1048576">SHACKLE</option>' +
                        '   <option value="2097152">MOUNT</option>' +
                        '   <option value="4194304">PERSUADE</option>' +
                        '   <option value="8388608">TURN</option>' +
                        '   <option value="16777216">HORROR</option>' +
                        '   <option value="33554432">INVULNERABILITY</option>' +
                        '   <option value="67108864">INTERRUPT</option>' +
                        '   <option value="134217728">DAZE</option>' +
                        '   <option value="268435456">DISCOVERY</option>' +
                        '   <option value="536870912">IMMUNE_SHIELD</option>' +
                        '   <option value="1073741824">SAPPED</option>' +
                        '</select>').appendTo(EventParam2DIV);
                    var NPCFlags = '#action_param2_val';
                    var Binary = "0x" + Hex(Lines[id].action_param2);
                    selectByte(NPCFlags, 0x0, Binary, 1);
                    selectByte(NPCFlags, 0x1, Binary, 2);
                    selectByte(NPCFlags, 0x2, Binary, 3);
                    selectByte(NPCFlags, 0x4, Binary, 4);
                    selectByte(NPCFlags, 0x8, Binary, 5);
                    selectByte(NPCFlags, 0x10, Binary, 6);
                    selectByte(NPCFlags, 0x20, Binary, 7);
                    selectByte(NPCFlags, 0x40, Binary, 8);
                    selectByte(NPCFlags, 0x80, Binary, 9);
                    selectByte(NPCFlags, 0x100, Binary, 10);
                    selectByte(NPCFlags, 0x200, Binary, 11);
                    selectByte(NPCFlags, 0x400, Binary, 12);
                    selectByte(NPCFlags, 0x800, Binary, 13);
                    selectByte(NPCFlags, 0x1000, Binary, 14);
                    selectByte(NPCFlags, 0x2000, Binary, 15);
                    selectByte(NPCFlags, 0x4000, Binary, 16);
                    selectByte(NPCFlags, 0x8000, Binary, 17);
                    selectByte(NPCFlags, 0x10000, Binary, 18);
                    selectByte(NPCFlags, 0x20000, Binary, 19);
                    selectByte(NPCFlags, 0x40000, Binary, 20);
                    selectByte(NPCFlags, 0x80000, Binary, 21);
                    selectByte(NPCFlags, 0x100000, Binary, 22);
                    selectByte(NPCFlags, 0x200000, Binary, 23);
                    selectByte(NPCFlags, 0x400000, Binary, 24);
                    selectByte(NPCFlags, 0x800000, Binary, 25);
                    selectByte(NPCFlags, 0x1000000, Binary, 26);
                    selectByte(NPCFlags, 0x2000000, Binary, 27);
                    selectByte(NPCFlags, 0x4000000, Binary, 28);
                    selectByte(NPCFlags, 0x8000000, Binary, 29);
                    selectByte(NPCFlags, 0x10000000, Binary, 30);
                    selectByte(NPCFlags, 0x20000000, Binary, 31);
                    selectByte(NPCFlags, 0x40000000, Binary, 32);
                    selectByte(NPCFlags, 0x80000000, Binary, 33);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                case "120":
                  EventParam1DIV.empty();
                  $('<select class="form-control" id="event_param1_val">' +
                    '   <option value="0">NONE</option>' +
                    '   <option value="1">BIND_SIGHT</option>' +
                    '   <option value="2">MOD_POSSESS</option>' +
                    '   <option value="3">PERIODIC_DAMAGE</option>' +
                    '   <option value="4">DUMMY</option>' +
                    '   <option value="5">MOD_CONFUSE</option>' +
                    '   <option value="6">MOD_CHARM</option>' +
                    '   <option value="7">MOD_FEAR</option>' +
                    '   <option value="8">PERIODIC_HEAL</option>' +
                    '   <option value="9">MOD_ATTACKSPEED</option>' +
                    '   <option value="10">MOD_THREAT</option>' +
                    '   <option value="11">MOD_TAUNT</option>' +
                    '   <option value="12">MOD_STUN</option>' +
                    '   <option value="13">MOD_DAMAGE_DONE</option>' +
                    '   <option value="14">MOD_DAMAGE_TAKEN</option>' +
                    '   <option value="15">DAMAGE_SHIELD</option>' +
                    '   <option value="16">MOD_STEALTH</option>' +
                    '   <option value="17">MOD_DETECT</option>' +
                    '   <option value="18">MOD_INVISIBILITY</option>' +
                    '   <option value="19">MOD_INVISIBILITY_DETECTION</option>' +
                    '   <option value="20">OBS_MOD_HEALTH</option>' +
                    '   <option value="21">OBS_MOD_POWER</option>' +
                    '   <option value="22">MOD_RESISTANCE</option>' +
                    '   <option value="23">PERIODIC_TRIGGER_SPELL</option>' +
                    '   <option value="24">PERIODIC_ENERGIZE</option>' +
                    '   <option value="25">MOD_PACIFY</option>' +
                    '   <option value="26">MOD_ROOT</option>' +
                    '   <option value="27">MOD_SILENCE</option>' +
                    '   <option value="28">REFLECT_SPELLS</option>' +
                    '   <option value="29">MOD_STAT</option>' +
                    '   <option value="30">MOD_SKILL</option>' +
                    '   <option value="31">MOD_INCREASE_SPEED</option>' +
                    '   <option value="32">MOD_INCREASE_MOUNTED_SPEED</option>' +
                    '   <option value="33">MOD_DECREASE_SPEED</option>' +
                    '   <option value="34">MOD_INCREASE_HEALTH</option>' +
                    '   <option value="35">MOD_INCREASE_ENERGY</option>' +
                    '   <option value="36">MOD_SHAPESHIFT</option>' +
                    '   <option value="37">EFFECT_IMMUNITY</option>' +
                    '   <option value="38">STATE_IMMUNITY</option>' +
                    '   <option value="39">SCHOOL_IMMUNITY</option>' +
                    '   <option value="40">DAMAGE_IMMUNITY</option>' +
                    '   <option value="41">DISPEL_IMMUNITY</option>' +
                    '   <option value="42">PROC_TRIGGER_SPELL</option>' +
                    '   <option value="43">PROC_TRIGGER_DAMAGE</option>' +
                    '   <option value="44">TRACK_CREATURES</option>' +
                    '   <option value="45">TRACK_RESOURCES</option>' +
                    '   <option value="46">MOD_PARRY_SKILL</option>' +
                    '   <option value="47">MOD_PARRY_PERCENT</option>' +
                    '   <option value="48">MOD_DODGE_SKILL</option>' +
                    '   <option value="49">MOD_DODGE_PERCENT</option>' +
                    '   <option value="50">MOD_BLOCK_SKILL</option>' +
                    '   <option value="51">MOD_BLOCK_PERCENT</option>' +
                    '   <option value="52">MOD_CRIT_PERCENT</option>' +
                    '   <option value="53">PERIODIC_LEECH</option>' +
                    '   <option value="54">MOD_HIT_CHANCE</option>' +
                    '   <option value="55">MOD_SPELL_HIT_CHANCE</option>' +
                    '   <option value="56">TRANSFORM</option>' +
                    '   <option value="57">MOD_SPELL_CRIT_CHANCE</option>' +
                    '   <option value="58">MOD_INCREASE_SWIM_SPEED</option>' +
                    '   <option value="59">MOD_DAMAGE_DONE_CREATURE</option>' +
                    '   <option value="60">MOD_PACIFY_SILENCE</option>' +
                    '   <option value="61">MOD_SCALE</option>' +
                    '   <option value="62">PERIODIC_HEALTH_FUNNEL</option>' +
                    '   <option value="63">PERIODIC_MANA_FUNNEL</option>' +
                    '   <option value="64">PERIODIC_MANA_LEECH</option>' +
                    '   <option value="65">MOD_CASTING_SPEED</option>' +
                    '   <option value="66">FEIGN_DEATH</option>' +
                    '   <option value="67">MOD_DISARM</option>' +
                    '   <option value="68">MOD_STALKED</option>' +
                    '   <option value="69">SCHOOL_ABSORB</option>' +
                    '   <option value="70">EXTRA_ATTACKS</option>' +
                    '   <option value="71">MOD_SPELL_CRIT_CHANCE_SCHOOL</option>' +
                    '   <option value="72">MOD_POWER_COST_SCHOOL_PCT</option>' +
                    '   <option value="73">MOD_POWER_COST_SCHOOL</option>' +
                    '   <option value="74">REFLECT_SPELLS_SCHOOL</option>' +
                    '   <option value="75">MOD_LANGUAGE</option>' +
                    '   <option value="76">FAR_SIGHT</option>' +
                    '   <option value="77">MECHANIC_IMMUNITY</option>' +
                    '   <option value="78">MOUNTED</option>' +
                    '   <option value="79">MOD_DAMAGE_PERCENT_DONE</option>' +
                    '   <option value="80">MOD_PERCENT_STAT</option>' +
                    '   <option value="81">SPLIT_DAMAGE_PCT</option>' +
                    '   <option value="82">WATER_BREATHING</option>' +
                    '   <option value="83">MOD_BASE_RESISTANCE</option>' +
                    '   <option value="84">MOD_REGEN</option>' +
                    '   <option value="85">MOD_POWER_REGEN</option>' +
                    '   <option value="86">CHANNEL_DEATH_ITEM</option>' +
                    '   <option value="87">MOD_DAMAGE_PERCENT_TAKEN</option>' +
                    '   <option value="88">MOD_HEALTH_REGEN_PERCENT</option>' +
                    '   <option value="89">PERIODIC_DAMAGE_PERCENT</option>' +
                    '   <option value="90">MOD_RESIST_CHANCE</option>' +
                    '   <option value="91">MOD_DETECT_RANGE</option>' +
                    '   <option value="92">PREVENTS_FLEEING</option>' +
                    '   <option value="93">MOD_UNATTACKABLE</option>' +
                    '   <option value="94">INTERRUPT_REGEN</option>' +
                    '   <option value="95">GHOST</option>' +
                    '   <option value="96">SPELL_MAGNET</option>' +
                    '   <option value="97">MANA_SHIELD</option>' +
                    '   <option value="98">MOD_SKILL_TALENT</option>' +
                    '   <option value="99">MOD_ATTACK_POWER</option>' +
                    '   <option value="100">AURAS_VISIBLE</option>' +
                    '   <option value="101">MOD_RESISTANCE_PCT</option>' +
                    '   <option value="102">MOD_MELEE_ATTACK_POWER_VERSUS</option>' +
                    '   <option value="103">MOD_TOTAL_THREAT</option>' +
                    '   <option value="104">WATER_WALK</option>' +
                    '   <option value="105">FEATHER_FALL</option>' +
                    '   <option value="106">HOVER</option>' +
                    '   <option value="107">ADD_FLAT_MODIFIER</option>' +
                    '   <option value="108">ADD_PCT_MODIFIER</option>' +
                    '   <option value="109">ADD_TARGET_TRIGGER</option>' +
                    '   <option value="110">MOD_POWER_REGEN_PERCENT</option>' +
                    '   <option value="111">ADD_CASTER_HIT_TRIGGER</option>' +
                    '   <option value="112">OVERRIDE_CLASS_SCRIPTS</option>' +
                    '   <option value="113">MOD_RANGED_DAMAGE_TAKEN</option>' +
                    '   <option value="114">MOD_RANGED_DAMAGE_TAKEN_PCT</option>' +
                    '   <option value="115">MOD_HEALING</option>' +
                    '   <option value="116">MOD_REGEN_DURING_COMBAT</option>' +
                    '   <option value="117">MOD_MECHANIC_RESISTANCE</option>' +
                    '   <option value="118">MOD_HEALING_PCT</option>' +
                    '   <option value="119">SHARE_PET_TRACKING</option>' +
                    '   <option value="120">UNTRACKABLE</option>' +
                    '   <option value="121">EMPATHY</option>' +
                    '   <option value="122">MOD_OFFHAND_DAMAGE_PCT</option>' +
                    '   <option value="123">MOD_TARGET_RESISTANCE</option>' +
                    '   <option value="124">MOD_RANGED_ATTACK_POWER</option>' +
                    '   <option value="125">MOD_MELEE_DAMAGE_TAKEN</option>' +
                    '   <option value="126">MOD_MELEE_DAMAGE_TAKEN_PCT</option>' +
                    '   <option value="127">RANGED_ATTACK_POWER_ATTACKER_BONUS</option>' +
                    '   <option value="128">MOD_POSSESS_PET</option>' +
                    '   <option value="129">MOD_SPEED_ALWAYS</option>' +
                    '   <option value="130">MOD_MOUNTED_SPEED_ALWAYS</option>' +
                    '   <option value="131">MOD_RANGED_ATTACK_POWER_VERSUS</option>' +
                    '   <option value="132">MOD_INCREASE_ENERGY_PERCENT</option>' +
                    '   <option value="133">MOD_INCREASE_HEALTH_PERCENT</option>' +
                    '   <option value="134">MOD_MANA_REGEN_INTERRUPT</option>' +
                    '   <option value="135">MOD_HEALING_DONE</option>' +
                    '   <option value="136">MOD_HEALING_DONE_PERCENT</option>' +
                    '   <option value="137">MOD_TOTAL_STAT_PERCENTAGE</option>' +
                    '   <option value="138">MOD_HASTE</option>' +
                    '   <option value="139">FORCE_REACTION</option>' +
                    '   <option value="140">MOD_RANGED_HASTE</option>' +
                    '   <option value="141">MOD_RANGED_AMMO_HASTE</option>' +
                    '   <option value="142">MOD_BASE_RESISTANCE_PCT</option>' +
                    '   <option value="143">MOD_RESISTANCE_EXCLUSIVE</option>' +
                    '   <option value="144">SAFE_FALL</option>' +
                    '   <option value="145">CHARISMA</option>' +
                    '   <option value="146">PERSUADED</option>' +
                    '   <option value="147">MECHANIC_IMMUNITY_MASK</option>' +
                    '   <option value="148">RETAIN_COMBO_POINTS</option>' +
                    '   <option value="149">RESIST_PUSHBACK</option>' +
                    '   <option value="150">MOD_SHIELD_BLOCKVALUE_PCT</option>' +
                    '   <option value="151">TRACK_STEALTHED</option>' +
                    '   <option value="152">MOD_DETECTED_RANGE</option>' +
                    '   <option value="153">SPLIT_DAMAGE_FLAT</option>' +
                    '   <option value="154">MOD_STEALTH_LEVEL</option>' +
                    '   <option value="155">MOD_WATER_BREATHING</option>' +
                    '   <option value="156">MOD_REPUTATION_GAIN</option>' +
                    '   <option value="157">PET_DAMAGE_MULTI</option>' +
                    '   <option value="158">MOD_SHIELD_BLOCKVALUE</option>' +
                    '   <option value="159">NO_PVP_CREDIT</option>' +
                    '   <option value="160">MOD_AOE_AVOIDANCE</option>' +
                    '   <option value="161">MOD_HEALTH_REGEN_IN_COMBAT</option>' +
                    '   <option value="162">POWER_BURN_MANA</option>' +
                    '   <option value="163">MOD_CRIT_DAMAGE_BONUS_MELEE</option>' +
                    '   <option value="164">164</option>' +
                    '   <option value="165">MELEE_ATTACK_POWER_ATTACKER_BONUS</option>' +
                    '   <option value="166">MOD_ATTACK_POWER_PCT</option>' +
                    '   <option value="167">MOD_RANGED_ATTACK_POWER_PCT</option>' +
                    '   <option value="168">MOD_DAMAGE_DONE_VERSUS</option>' +
                    '   <option value="169">MOD_CRIT_PERCENT_VERSUS</option>' +
                    '   <option value="170">DETECT_AMORE</option>' +
                    '   <option value="171">MOD_SPEED_NOT_STACK</option>' +
                    '   <option value="172">MOD_MOUNTED_SPEED_NOT_STACK</option>' +
                    '   <option value="173">ALLOW_CHAMPION_SPELLS</option>' +
                    '   <option value="174">MOD_SPELL_DAMAGE_OF_STAT_PERCENT</option>' +
                    '   <option value="175">MOD_SPELL_HEALING_OF_STAT_PERCENT</option>' +
                    '   <option value="176">SPIRIT_OF_REDEMPTION</option>' +
                    '   <option value="177">AOE_CHARM</option>' +
                    '   <option value="178">MOD_DEBUFF_RESISTANCE</option>' +
                    '   <option value="179">MOD_ATTACKER_SPELL_CRIT_CHANCE</option>' +
                    '   <option value="180">MOD_FLAT_SPELL_DAMAGE_VERSUS</option>' +
                    '   <option value="181">MOD_FLAT_SPELL_CRIT_DAMAGE_VERSUS</option>' +
                    '   <option value="182">MOD_RESISTANCE_OF_STAT_PERCENT</option>' +
                    '   <option value="183">MOD_CRITICAL_THREAT</option>' +
                    '   <option value="184">MOD_ATTACKER_MELEE_HIT_CHANCE</option>' +
                    '   <option value="185">MOD_ATTACKER_RANGED_HIT_CHANCE</option>' +
                    '   <option value="186">MOD_ATTACKER_SPELL_HIT_CHANCE</option>' +
                    '   <option value="187">MOD_ATTACKER_MELEE_CRIT_CHANCE</option>' +
                    '   <option value="188">MOD_ATTACKER_RANGED_CRIT_CHANCE</option>' +
                    '   <option value="189">MOD_RATING</option>' +
                    '   <option value="190">MOD_FACTION_REPUTATION_GAIN</option>' +
                    '   <option value="191">USE_NORMAL_MOVEMENT_SPEED</option>' +
                    '   <option value="192">HASTE_MELEE</option>' +
                    '   <option value="193">MELEE_SLOW</option>' +
                    '   <option value="194">MOD_DEPRICATED_1</option>' +
                    '   <option value="195">MOD_DEPRICATED_2</option>' +
                    '   <option value="196">MOD_COOLDOWN</option>' +
                    '   <option value="197">MOD_ATTACKER_SPELL_AND_WEAPON_CRIT_CHANCE</option>' +
                    '   <option value="198">MOD_ALL_WEAPON_SKILLS</option>' +
                    '   <option value="199">MOD_INCREASES_SPELL_PCT_TO_HIT</option>' +
                    '   <option value="200">MOD_XP_PCT</option>' +
                    '   <option value="201">FLY</option>' +
                    '   <option value="202">IGNORE_COMBAT_RESULT</option>' +
                    '   <option value="203">MOD_ATTACKER_MELEE_CRIT_DAMAGE</option>' +
                    '   <option value="204">MOD_ATTACKER_RANGED_CRIT_DAMAGE</option>' +
                    '   <option value="205">205</option>' +
                    '   <option value="206">MOD_INCREASE_VEHICLE_FLIGHT_SPEED</option>' +
                    '   <option value="207">MOD_INCREASE_MOUNTED_FLIGHT_SPEED</option>' +
                    '   <option value="208">MOD_INCREASE_FLIGHT_SPEED</option>' +
                    '   <option value="209">MOD_MOUNTED_FLIGHT_SPEED_ALWAYS</option>' +
                    '   <option value="210">210</option>' +
                    '   <option value="211">MOD_FLIGHT_SPEED_NOT_STACK</option>' +
                    '   <option value="212">MOD_RANGED_ATTACK_POWER_OF_STAT_PERCENT</option>' +
                    '   <option value="213">MOD_RAGE_FROM_DAMAGE_DEALT</option>' +
                    '   <option value="214">214</option>' +
                    '   <option value="215">ARENA_PREPARATION</option>' +
                    '   <option value="216">HASTE_SPELLS</option>' +
                    '   <option value="217">217</option>' +
                    '   <option value="218">HASTE_RANGED</option>' +
                    '   <option value="219">MOD_MANA_REGEN_FROM_STAT</option>' +
                    '   <option value="220">MOD_RATING_FROM_STAT</option>' +
                    '   <option value="221">IGNORED</option>' +
                    '   <option value="222">222</option>' +
                    '   <option value="223">223</option>' +
                    '   <option value="224">224</option>' +
                    '   <option value="225">PRAYER_OF_MENDING</option>' +
                    '   <option value="226">PERIODIC_DUMMY</option>' +
                    '   <option value="227">PERIODIC_TRIGGER_SPELL_WITH_VALUE</option>' +
                    '   <option value="228">DETECT_STEALTH</option>' +
                    '   <option value="229">MOD_AOE_DAMAGE_AVOIDANCE</option>' +
                    '   <option value="230">230</option>' +
                    '   <option value="231">231</option>' +
                    '   <option value="232">MECHANIC_DURATION_MOD</option>' +
                    '   <option value="233">233</option>' +
                    '   <option value="234">MECHANIC_DURATION_MOD_NOT_STACK</option>' +
                    '   <option value="235">MOD_DISPEL_RESIST</option>' +
                    '   <option value="236">236</option>' +
                    '   <option value="237">MOD_SPELL_DAMAGE_OF_ATTACK_POWER</option>' +
                    '   <option value="238">MOD_SPELL_HEALING_OF_ATTACK_POWER</option>' +
                    '   <option value="239">MOD_SCALE_2</option>' +
                    '   <option value="240">MOD_EXPERTISE</option>' +
                    '   <option value="241">FORCE_MOVE_FORWARD</option>' +
                    '   <option value="242">MOD_SPELL_DAMAGE_FROM_HEALING</option>' +
                    '   <option value="243">243</option>' +
                    '   <option value="244">COMPREHEND_LANGUAGE</option>' +
                    '   <option value="245">MOD_DURATION_OF_MAGIC_EFFECTS</option>' +
                    '   <option value="246">246</option>' +
                    '   <option value="247">CLONE_CASTER</option>' +
                    '   <option value="248">MOD_COMBAT_RESULT_CHANCE</option>' +
                    '   <option value="249">249</option>' +
                    '   <option value="250">MOD_INCREASE_HEALTH_2</option>' +
                    '   <option value="251">MOD_ENEMY_DODGE</option>' +
                    '   <option value="252">252</option>' +
                    '   <option value="253">253</option>' +
                    '   <option value="254">254</option>' +
                    '   <option value="255">255</option>' +
                    '   <option value="256">256</option>' +
                    '   <option value="257">257</option>' +
                    '   <option value="258">258</option>' +
                    '   <option value="259">APPLY_IMMUNITY_ID</option>' +
                    '   <option value="260">APPLY_EXTRA_FLAG</option>' +
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
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "5":
                    ActionParam1DIV.empty();
                    $(getEmoteSelect('action', 1)).appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "10":
                    ActionParam1DIV.empty();
                    $(getEmoteSelect('action', 1)).appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    ActionParam2DIV.empty();
                    $(getEmoteSelect('action', 2)).appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    ActionParam3DIV.empty();
                    $(getEmoteSelect('action', 3)).appendTo(ActionParam3DIV);
                    $('#action_param3_val').val(Lines[id].action_param3);
                    ActionParam4DIV.empty();
                    $(getEmoteSelect('action', 4)).appendTo(ActionParam4DIV);
                    $('#action_param4_val').val(Lines[id].action_param4);
                    ActionParam5DIV.empty();
                    $(getEmoteSelect('action', 5)).appendTo(ActionParam5DIV);
                    $('#action_param5_val').val(Lines[id].action_param5);
                    ActionParam6DIV.empty();
                    $(getEmoteSelect('action', 6)).appendTo(ActionParam6DIV);
                    $('#action_param6_val').val(Lines[id].action_param6);
                    break;
                case "8":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Passive</option>' +
                    '   <option value="1">Defensive</option>' +
                    '   <option value="2">Aggressive</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    selectByte(Flags, 0x1, Binary, 2);
                    selectByte(Flags, 0x2, Binary, 3);
                    selectByte(Flags, 0x20, Binary, 4);
                    selectByte(Flags, 0x40, Binary, 5);
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
                case "17":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                        '   <option value="0">None</option>' +
                        '   <option value="10">Dance</option>' +
                        '   <option value="12">Sleep</option>' +
                        '   <option value="13">Sit</option>' +
                        '   <option value="26">Stand</option>' +
                        '   <option value="27">Ready Unarmed</option>' +
                        '   <option value="28">Work</option>' +
                        '   <option value="29">Point</option>' +
                        '   <option value="64">Stun</option>' +
                        '   <option value="65">Dead</option>' +
                        '   <option value="68">Kneel</option>' +
                        '   <option value="69">Uses Standing</option>' +
                        '   <option value="93">Stun No Sheathe</option>' +
                        '   <option value="133">Uses Standing No Sheathe</option>' +
                        '   <option value="173">Work No Sheathe</option>' +
                        '   <option value="193">Spell Pre Cast</option>' +
                        '   <option value="214">Ready Rifle</option>' +
                        '   <option value="233">Work No Sheathe Mining</option>' +
                        '   <option value="234">Work No Sheathe Chop Wood</option>' +
                        '   <option value="313">At Ease</option>' +
                        '   <option value="333">Ready 1H</option>' +
                        '   <option value="353">Spell Kneel Start</option>' +
                        '   <option value="373">Submerged</option>' +
                        '   <option value="375">Ready 2H</option>' +
                        '   <option value="376">Ready Bow</option>' +
                        '   <option value="378">Talk</option>' +
                        '   <option value="379">Fishing</option>' +
                        '   <option value="382">Whirlwind</option>' +
                        '   <option value="383">Drowned</option>' +
                        '   <option value="384">Hold Bow</option>' +
                        '   <option value="385">How Rifle</option>' +
                        '   <option value="386">Hold Thrown</option>' +
                        '   <option value="391">Roar</option>' +
                        '   <option value="392">Laugh</option>' +
                        '   <option value="398">Cannibalize</option>' +
                        '   <option value="400">Dance Special</option>' +
                        '   <option value="412">Exclaim</option>' +
                        '   <option value="415">Sit Chair Medium</option>' +
                        '   <option value="422">Spell Effect Hold</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "18": //ACTION_SET_UNIT_FLAG
                case "19": //ACTION_REMOVE_UNIT_FLAG
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                        '   <option value="0">UNIT_FLAGS</option>' +
                        '   <option value="1">UNIT_FLAGS2</option>' +
                        '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    ActionParam1DIV.empty();
                    if (Lines[id].action_param2 == "0") {
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">SERVER_CONTROLLED</option>' +
                        '   <option value="2">NON_ATTACKABLE</option>' +
                        '   <option value="4">REMOVE_CLIENT_CONTROL</option>' +
                        '   <option value="8">PLAYER_CONTROLLED</option>' +
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
                        '   <option value="16384">PERSUADED</option>' +
                        '   <option value="32768">SWIMMING</option>' +
                        '   <option value="65536">NON_ATTACKABLE_2</option>' +
                        '   <option value="131072">PACIFIED</option>' +
                        '   <option value="262144">STUNNED</option>' +
                        '   <option value="524288">IN_COMBAT</option>' +
                        '   <option value="1048576">TAXI_FLIGHT</option>' +
                        '   <option value="2097152">DISARMED</option>' +
                        '   <option value="4194304">CONFUSED</option>' +
                        '   <option value="8388608">FLEEING</option>' +
                        '   <option value="16777216">PLAYER_CONTROLLED</option>' + //25
                        '   <option value="33554432">POSSESSED</option>' +
                        '   <option value="67108864">SKINNABLE</option>' +
                        '   <option value="134217728">MOUNT</option>' +
                        '   <option value="268435456">UNK_28</option>' +
                        '   <option value="536870912">UNK_29</option>' +
                        '   <option value="1073741824">SHEATHE</option>' +
                        '   <option value="2147483648">IMMUNE</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        selectByte(NPCFlags, 0x0, Binary, 1);
                        selectByte(NPCFlags, 0x1, Binary, 2);
                        selectByte(NPCFlags, 0x2, Binary, 3);
                        selectByte(NPCFlags, 0x4, Binary, 4);
                        selectByte(NPCFlags, 0x8, Binary, 5);
                        selectByte(NPCFlags, 0x10, Binary, 6);
                        selectByte(NPCFlags, 0x20, Binary, 7);
                        selectByte(NPCFlags, 0x40, Binary, 8);
                        selectByte(NPCFlags, 0x80, Binary, 9);
                        selectByte(NPCFlags, 0x100, Binary, 10);
                        selectByte(NPCFlags, 0x200, Binary, 11);
                        selectByte(NPCFlags, 0x400, Binary, 12);
                        selectByte(NPCFlags, 0x800, Binary, 13);
                        selectByte(NPCFlags, 0x1000, Binary, 14);
                        selectByte(NPCFlags, 0x2000, Binary, 15);
                        selectByte(NPCFlags, 0x4000, Binary, 16);
                        selectByte(NPCFlags, 0x8000, Binary, 17);
                        selectByte(NPCFlags, 0x10000, Binary, 18);
                        selectByte(NPCFlags, 0x20000, Binary, 19);
                        selectByte(NPCFlags, 0x40000, Binary, 20);
                        selectByte(NPCFlags, 0x80000, Binary, 21);
                        selectByte(NPCFlags, 0x100000, Binary, 22);
                        selectByte(NPCFlags, 0x200000, Binary, 23);
                        selectByte(NPCFlags, 0x400000, Binary, 24);
                        selectByte(NPCFlags, 0x800000, Binary, 25);
                        selectByte(NPCFlags, 0x1000000, Binary, 26);
                        selectByte(NPCFlags, 0x2000000, Binary, 27);
                        selectByte(NPCFlags, 0x4000000, Binary, 28);
                        selectByte(NPCFlags, 0x8000000, Binary, 29);
                        selectByte(NPCFlags, 0x10000000, Binary, 30);
                        selectByte(NPCFlags, 0x20000000, Binary, 31);
                        selectByte(NPCFlags, 0x40000000, Binary, 32);
                        selectByte(NPCFlags, 0x80000000, Binary, 33);
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
                        selectByte(NPCFlags, 0x1, Binary, 1);
                        selectByte(NPCFlags, 0x8, Binary, 2);
                        selectByte(NPCFlags, 0x10, Binary, 3);
                        selectByte(NPCFlags, 0x40, Binary, 4);
                    }
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "20":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Stop</option>' +
                    '   <option value="1">Start</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    break;
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                case "21":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Disable</option>' +
                    '   <option value="1">Enable</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
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
                case "156":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    ActionParam5DIV.empty();
                    $('<select class="form-control" id="action_param5_val">' +
                        '   <option value="0">Monster KIll</option>' +
                        '   <option value="1">Event</option>' +
                        '</select>').appendTo(ActionParam5DIV);
                    $('#action_param5_val').val(Lines[id].action_param5);
                    displayActionValDefault(6, id);
                    break;
                case "34":
                    displayActionValDefault(1, id);
                    displayActionValDefault(2, id);
                    ActionParam3DIV.empty();
                    $('<select class="form-control" id="action_param3_val">' +
                        '   <option value="0">Data</option>' +
                        '   <option value="1">Boss State</option>' +
                        '</select>').appendTo(ActionParam3DIV);
                    $('#action_param3_val').val(Lines[id].action_param3);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "40":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                    '   <option value="0">Unarmed</option>' +
                    '   <option value="1">Melee</option>' +
                    '   <option value="2">Ranged</option>' +
                    '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    '   <option value="6">CASTER_SUN</option>' +
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
                    }
                    break;
                case "69":
                    displayActionValDefault(1, id);
                    displayActionValDefault(2, id);
                    ActionParam3DIV.empty();
                    $('<select class="form-control" id="action_param3_val">' +
                        '   <option value="0">No</option>' +
                        '   <option value="1">Yes</option>' +
                        '</select>').appendTo(ActionParam3DIV);
                    $('#action_param3_val').val(Lines[id].action_param3);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "80":
                    displayActionValDefault(1, id);
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                    '   <option value="0">UPDATE_OOC</option>' +
                    '   <option value="1">UPDATE_IC</option>' +
                    '   <option value="2">UPDATE</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    selectByte(NPCFlags, 0x0, Binary, 1);
                    selectByte(NPCFlags, 0x1, Binary, 2);
                    selectByte(NPCFlags, 0x2, Binary, 3);
                    selectByte(NPCFlags, 0x4, Binary, 4);
                    selectByte(NPCFlags, 0x8, Binary, 5);
                    selectByte(NPCFlags, 0x10, Binary, 6);
                    selectByte(NPCFlags, 0x20, Binary, 7);
                    selectByte(NPCFlags, 0x40, Binary, 8);
                    selectByte(NPCFlags, 0x80, Binary, 9);
                    selectByte(NPCFlags, 0x100, Binary, 10);
                    selectByte(NPCFlags, 0x200, Binary, 11);
                    selectByte(NPCFlags, 0x400, Binary, 12);
                    selectByte(NPCFlags, 0x800, Binary, 13);
                    selectByte(NPCFlags, 0x1000, Binary, 14);
                    selectByte(NPCFlags, 0x2000, Binary, 15);
                    selectByte(NPCFlags, 0x4000, Binary, 16);
                    selectByte(NPCFlags, 0x8000, Binary, 17);
                    selectByte(NPCFlags, 0x10000, Binary, 18);
                    selectByte(NPCFlags, 0x20000, Binary, 19);
                    selectByte(NPCFlags, 0x40000, Binary, 20);
                    selectByte(NPCFlags, 0x80000, Binary, 21);
                    selectByte(NPCFlags, 0x100000, Binary, 22);
                    selectByte(NPCFlags, 0x200000, Binary, 23);
                    selectByte(NPCFlags, 0x400000, Binary, 24);
                    selectByte(NPCFlags, 0x800000, Binary, 25);
                    selectByte(NPCFlags, 0x1000000, Binary, 26);
                    selectByte(NPCFlags, 0x4000000, Binary, 27);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                        selectByte(NPCFlags, 0x0, Binary, 1);
                        selectByte(NPCFlags, 0x1, Binary, 2);
                        selectByte(NPCFlags, 0x2, Binary, 3);
                        selectByte(NPCFlags, 0x4, Binary, 4);
                        selectByte(NPCFlags, 0x8, Binary, 5);
                        selectByte(NPCFlags, 0x10, Binary, 6);
                        selectByte(NPCFlags, 0xFF, Binary, 7);
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
                        selectByte(NPCFlags, 0x0, Binary, 1);
                        selectByte(NPCFlags, 0x1, Binary, 2);
                        selectByte(NPCFlags, 0x2, Binary, 3);
                        selectByte(NPCFlags, 0x4, Binary, 4);
                        selectByte(NPCFlags, 0x8, Binary, 5);
                        selectByte(NPCFlags, 0x10, Binary, 6);
                        selectByte(NPCFlags, 0xFF, Binary, 7);
                    }
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                    '   <option value="0">STAND_STATE_TYPE</option>' +
                    '   <option value="2">STAND_FLAGS_TYPE</option>' +
                    '   <option value="3">BYTES1_FLAGS_TYPE</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    selectByte(NPCFlags, 0x0, Binary, 1);
                    selectByte(NPCFlags, 0x1, Binary, 2);
                    selectByte(NPCFlags, 0x2, Binary, 3);
                    selectByte(NPCFlags, 0x4, Binary, 4);
                    selectByte(NPCFlags, 0x8, Binary, 5);
                    selectByte(NPCFlags, 0x10, Binary, 6);
                    selectByte(NPCFlags, 0x20, Binary, 7);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    selectByte(NPCFlags, 0x0, Binary, 1);
                    selectByte(NPCFlags, 0x1, Binary, 2);
                    selectByte(NPCFlags, 0x2, Binary, 3);
                    selectByte(NPCFlags, 0x4, Binary, 4);
                    selectByte(NPCFlags, 0x8, Binary, 5);
                    selectByte(NPCFlags, 0x10, Binary, 6);
                    selectByte(NPCFlags, 0x20, Binary, 7);
                    selectByte(NPCFlags, 0x40, Binary, 8);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "115":
                    displayActionValDefault(1, id);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    ActionParam6DIV.empty();
                    $('<select class="form-control" id="action_param6_val">' +
                        '   <option value="0">No</option>' +
                        '   <option value="1">Yes</option>' +
                        '</select>').appendTo(ActionParam6DIV);
                    $('#action_param6_val').val(Lines[id].action_param6);
                    break;
                case "117":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                        '   <option value="0">Enable</option>' +
                        '   <option value="1">Disable</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "118":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                        '   <option value="0">ACTIVE</option>' +
                        '   <option value="1">READY</option>' +
                        '   <option value="2">ACTIVE_ALTERNATIVE</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    displayActionValDefault(2, id);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "127":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                      '   <option value="0">No</option>' +
                      '   <option value="1">Yes</option>' +
                      '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                      '   <option value="0">No</option>' +
                      '   <option value="1">Yes</option>' +
                      '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                    else if (Lines[id].action_param2 == "1") {
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
                        selectByte(NPCFlags, 0x0, Binary, 1);
                        selectByte(NPCFlags, 0x1, Binary, 2);
                        selectByte(NPCFlags, 0x2, Binary, 3);
                        selectByte(NPCFlags, 0x4, Binary, 4);
                        selectByte(NPCFlags, 0x8, Binary, 5);
                        selectByte(NPCFlags, 0x10, Binary, 6);
                        selectByte(NPCFlags, 0x20, Binary, 7);
                        selectByte(NPCFlags, 0x40, Binary, 8);
                    }
                    else if (Lines[id].action_param2 == "2") {
                        ActionParam1.addClass('display_flags');
                        ActionParam1DIV.empty();
                        $('<select multiple class="form-control npc_flags" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="2">NOT_ALLOWED</option>' +
                        '   <option value="3">ALLOWED</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                        var NPCFlags = '#action_param1_val';
                        var Binary = "0x" + Hex(Lines[id].action_param1);
                        selectByte(NPCFlags, 0x0, Binary, 1);
                        selectByte(NPCFlags, 0x2, Binary, 2);
                        selectByte(NPCFlags, 0x3, Binary, 3);
                    }
                    ActionParam2DIV.empty();
                    ActionParam2.addClass('display_flags');
                    $('<select class="form-control" id="action_param2_val">' +
                    '   <option value="0">SHEATH_STATE</option>' +
                    '   <option value="1">BYTES2_FLAGS_TYPE</option>' +
                    '   <option value="2">UNIT_RENAME</option>' +
                    '</select>').appendTo(ActionParam2DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "160":
                    ActionParam1DIV.empty();
                    $('<select class="form-control" id="action_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="2">CHARM</option>' +
                        '   <option value="4">DISORIENTED</option>' +
                        '   <option value="8">DISARM</option>' +
                        '   <option value="16">DISTRACT</option>' +
                        '   <option value="32">FEAR</option>' +
                        '   <option value="64">FUMBLE</option>' +
                        '   <option value="128">ROOT</option>' +
                        '   <option value="256">PACIFY</option>' +
                        '   <option value="512">SILENCE</option>' +
                        '   <option value="1024">SLEEP</option>' +
                        '   <option value="2048">SNARE</option>' +
                        '   <option value="4096">STUN</option>' +
                        '   <option value="8192">FREEZE</option>' +
                        '   <option value="16384">KNOCKOUT</option>' +
                        '   <option value="32768">BLEED</option>' +
                        '   <option value="65536">BANDAGE</option>' +
                        '   <option value="131072">POLYMORPH</option>' +
                        '   <option value="262144">BANISH</option>' +
                        '   <option value="524288">SHIELD</option>' +
                        '   <option value="1048576">SHACKLE</option>' +
                        '   <option value="2097152">MOUNT</option>' +
                        '   <option value="4194304">PERSUADE</option>' +
                        '   <option value="8388608">TURN</option>' +
                        '   <option value="16777216">HORROR</option>' +
                        '   <option value="33554432">INVULNERABILITY</option>' +
                        '   <option value="67108864">INTERRUPT</option>' +
                        '   <option value="134217728">DAZE</option>' +
                        '   <option value="268435456">DISCOVERY</option>' +
                        '   <option value="536870912">IMMUNE_SHIELD</option>' +
                        '   <option value="1073741824">SAPPED</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                    $('#action_param1_val').val(Lines[id].action_param1);
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                        '   <option value="0">Remove</option>' +
                        '   <option value="1">Apply</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
                    break;
                case "161":
                    displayActionValDefault(1, id);
                    ActionParam2DIV.empty();
                    $('<select class="form-control" id="action_param2_val">' +
                        '   <option value="0">Remove</option>' +
                        '   <option value="1">Apply</option>' +
                        '</select>').appendTo(ActionParam1DIV);
                    $('#action_param2_val').val(Lines[id].action_param2);
                    displayActionValDefault(3, id);
                    displayActionValDefault(4, id);
                    displayActionValDefault(5, id);
                    displayActionValDefault(6, id);
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
                case "3":
                case "4":
                case "5":
                case "6":
                    displayTargetValDefault(1, id);
                    TargetParam2DIV.empty();
                    $('<select class="form-control" id="target_param2_val">' +
                      '   <option value="0">No</option>' +
                      '   <option value="1">Yes</option>' +
                      '</select>').appendTo(TargetParam2DIV);
                    $('#target_param2_val').val(Lines[id].target_param2);
                    TargetParam3DIV.empty();
                    $('<select class="form-control" id="target_param3_val">' +
                      '   <option value="0">NONE</option>' +
                      '   <option value="1">MANA</option>' +
                      '   <option value="2">RAGE</option>' +
                      '   <option value="3">FOCUS</option>' +
                      '   <option value="4">ENERGY</option>' +
                      '   <option value="5">HAPPINESS</option>' +
                      '</select>').appendTo(TargetParam3DIV);
                    $('#target_param3_val').val(Lines[id].target_param3);
                    displayTargetValDefault("x", id);
                    displayTargetValDefault("y", id);
                    displayTargetValDefault("z", id);
                    displayTargetValDefault("o", id);
                    break;
                case "19":
                    displayTargetValDefault(1, id);
                    displayTargetValDefault(2, id);
                    TargetParam3DIV.empty();
                    $('<select class="form-control" id="target_param3_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(TargetParam3DIV);
                    $('#target_param3_val').val(Lines[id].target_param3);
                    displayTargetValDefault("x", id);
                    displayTargetValDefault("y", id);
                    displayTargetValDefault("z", id);
                    displayTargetValDefault("o", id);
                    break;
                case "23":
                    TargetParam1DIV.empty();
                    $('<select class="form-control" id="target_param1_val">' +
                      '   <option value="0">No</option>' +
                      '   <option value="1">Yes</option>' +
                      '</select>').appendTo(TargetParam1DIV);
                    $('#target_param1_val').val(Lines[id].target_param1);
                    displayTargetValDefault(2, id);
                    displayTargetValDefault(3, id);
                    displayTargetValDefault("x", id);
                    displayTargetValDefault("y", id);
                    displayTargetValDefault("z", id);
                    displayTargetValDefault("o", id);
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
                    displayTargetValDefault(3, id);
                    displayTargetValDefault("x", id);
                    displayTargetValDefault("y", id);
                    displayTargetValDefault("z", id);
                    displayTargetValDefault("o", id);
                    break;
                case "28":
                    displayTargetValDefault(1, id);
                    TargetParam2DIV.empty();
                    $('<select class="form-control" id="target_param2_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(TargetParam2DIV);
                    $('#target_param2_val').val(Lines[id].target_param2);
                    TargetParam3DIV.empty();
                    $('<select class="form-control" id="target_param3_val">' +
                    '   <option value="0">No</option>' +
                    '   <option value="1">Yes</option>' +
                    '</select>').appendTo(TargetParam3DIV);
                    $('#target_param3_val').val(Lines[id].target_param3);
                    displayTargetValDefault("x", id);
                    displayTargetValDefault("y", id);
                    displayTargetValDefault("z", id);
                    displayTargetValDefault("o", id);
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
        $('#event_chance_val').change(function () {
            var id = $('table > tbody > tr.active > td:first-child').text();
            Lines[id].event_chance = $(this).val();
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
                Lines[id].action_type == "91" ||
                Lines[id].action_type == "18" ||
                Lines[id].action_type == "19") {
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
        TargetXDIV.on("change", '#target_x_val', function () {
            setTargetParamValue("x");
        });
        TargetYDIV.on("change", '#target_y_val', function () {
            setTargetParamValue("y");
        });
        TargetZDIV.on("change", '#target_z_val', function () {
            setTargetParamValue("z");
        });
        TargetODIV.on("change", '#target_o_val', function () {
            setTargetParamValue("o");
        });

        function setEventParamValue(param) {
            var attr = 'event_param' + param;
            var value = $('#event_param' + param + '_val').val();
            var id = $('table > tbody > tr.active > td:first-child').text();
            
            var total = 0;
            switch(EventType.val()) {
                case "104": //EVENT_GO_LOOT_STATE_CHANGED
                    if (param == 1) {
                        for (i = 0; i < value.length; i++) {
                            total += value[i] << 0;
                        }
                        Lines[id][attr] = total;
                    } else
                        Lines[id][attr] = value;
                    break;
                default:
                    Lines[id][attr] = value;
            }
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
                    if (param == 2) {
                        for (i = 0; i < value.length; i++) {
                            total += value[i] << 0;
                        }
                        Lines[id][attr] = total;
                    } else
                        Lines[id][attr] = value;
                    break;
                case "18": //ACTION_SET_UNIT_FLAG
                case "19": //ACTION_REMOVE_UNIT_FLAG
                case "81": //ACTION_SET_NPC_FLAG
                case "82": //ACTION_ADD_NPC_FLAG
                case "83": //ACTION_REMOVE_NPC_FLAG
                case "94": //ACTION_SET_DYNAMIC_FLAG
                case "95": //ACTION_ADD_DYNAMIC_FLAG
                case "104": //ACTION_SET_GO_FLAG
                case "105": //ACTION_ADD_GO_FLAG
                case "106": //ACTION_REMOVE_GO_FLAG
                    if (param == 1) {
                        for (i = 0; i < value.length; i++)
                            total += value[i] << 0;
                        Lines[id][attr] = total;
                    } else
                        Lines[id][attr] = value;
                    break;
                case "90": //ACTION_SET_UNIT_FIELD_BYTES_1
                case "91": //ACTION_REMOVE_UNIT_FIELD_BYTES_1
                    if (param == 2 || param == 3) {
                        for (i = 0; i < value.length; i++)
                            total += value[i] << 0;
                        Lines[id][attr] = total;
                    } else
                        Lines[id][attr] = value;
                    break;
                case "150": //ACTION_SET_UNIT_FIELD_BYTES_2
                case "151": //ACTION_REMOVE_UNIT_FIELD_BYTES_2
                    if (param == 1 || param == 2) {
                        for (i = 0; i < value.length; i++)
                            total += value[i] << 0;
                        Lines[id][attr] = total;
                    } else
                        Lines[id][attr] = value;
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
            } else
                $('#target_' + coord + '_val').show();
        }
        function changeEventsParams(Line) {
            switch (Line.event_type) {
                case "5": //EVENT_KILL
                    EventParam1.html(Events[Line.event_type].param1);
                    EventParam2.html(Events[Line.event_type].param2);
                    EventParam3.html(Events[Line.event_type].param3);
                    if (Line.event_param3 == "0")
                        EventParam4.html('Creature ID');
                    else
                        EventParam4.html('');
                    break;
                default:
                    EventParam1.html(Events[Line.event_type].param1);
                    EventParam2.html(Events[Line.event_type].param2);
                    EventParam3.html(Events[Line.event_type].param3);
                    EventParam4.html(Events[Line.event_type].param4);
            }
            for (i = 0; i < 5; i++) {
                if ($('#event_param' + i).text() == "" || Line.event_type == "61")
                    $('#event_param' + i + '_val').hide();
                else
                    $('#event_param' + i + '_val').show();
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
                        case "6":
                            ActionParam2.html('Spell ID');
                            ActionParam3.html('RepeatMin');
                            ActionParam4.html('RepeatMax');
                            ActionParam5.html('Cast flags');
                            ActionParam6.html('Range (can be 0)');
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
                if ($('#action_param' + i).text() == "")
                    $('#action_param' + i + '_val').hide();
                else
                    $('#action_param' + i + '_val').show();
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
                if ($('#target_param' + i).text() == "")
                    $('#target_param' + i + '_val').hide();
                else
                    $('#target_param' + i + '_val').show();
            }
            target("x");
            target("y");
            target("z");
            target("o");
        }

        function getReceiveEmoteSelect(type, param)
        {
           return '<select class="form-control" id="'+type+'_param'+param+'_val">' +
                '   <option value="0">None</option>' +
                '   <option value="1">Agree</option>' +
                '   <option value="2">Amaze</option>' +
                '   <option value="3">Angry</option>' +
                '   <option value="4">Apologize</option>' +
                '   <option value="5">Applaud</option>' +
                '   <option value="6">Bashful</option>' +
                '   <option value="7">Beckon</option>' +
                '   <option value="8">Beg</option>' +
                '   <option value="9">Bite</option>' +
                '   <option value="10">Bleed</option>' +
                '   <option value="11">Blink</option>' +
                '   <option value="12">Blush</option>' +
                '   <option value="13">Bonk</option>' +
                '   <option value="14">Bored</option>' +
                '   <option value="15">Bounce</option>' +
                '   <option value="16">Brb</option>' +
                '   <option value="17">Bow</option>' +
                '   <option value="18">Burp</option>' +
                '   <option value="19">Bye</option>' +
                '   <option value="20">Cackle</option>' +
                '   <option value="21">Cheer</option>' +
                '   <option value="22">Chicken</option>' +
                '   <option value="23">Chuckle</option>' +
                '   <option value="24">Clap</option>' +
                '   <option value="25">Confused</option>' +
                '   <option value="26">Congratulate</option>' +
                '   <option value="27">Cough</option>' +
                '   <option value="28">Cower</option>' +
                '   <option value="29">Crack</option>' +
                '   <option value="30">Cringe</option>' +
                '   <option value="31">Cry</option>' +
                '   <option value="32">Curious</option>' +
                '   <option value="33">Curtsey</option>' +
                '   <option value="34">Dance</option>' +
                '   <option value="35">Drink</option>' +
                '   <option value="36">Drool</option>' +
                '   <option value="37">Eat</option>' +
                '   <option value="38">Eye</option>' +
                '   <option value="39">Fart</option>' +
                '   <option value="40">Fidget</option>' +
                '   <option value="41">Flex</option>' +
                '   <option value="42">Frown</option>' +
                '   <option value="43">Gasp</option>' +
                '   <option value="44">Gaze</option>' +
                '   <option value="45">Giggle</option>' +
                '   <option value="46">Glare</option>' +
                '   <option value="47">Gloat</option>' +
                '   <option value="48">Greet</option>' +
                '   <option value="49">Grin</option>' +
                '   <option value="50">Groan</option>' +
                '   <option value="51">Grovel</option>' +
                '   <option value="52">Guffaw</option>' +
                '   <option value="53">Hail</option>' +
                '   <option value="54">Happy</option>' +
                '   <option value="55">Hello</option>' +
                '   <option value="56">Hug</option>' +
                '   <option value="57">Hungry</option>' +
                '   <option value="58">Kiss</option>' +
                '   <option value="59">Kneel</option>' +
                '   <option value="60">Laugh</option>' +
                '   <option value="61">Laydown</option>' +
                '   <option value="62">Message</option>' +
                '   <option value="63">Moan</option>' +
                '   <option value="64">Moon</option>' +
                '   <option value="65">Mourn</option>' +
                '   <option value="66">No</option>' +
                '   <option value="67">Nod</option>' +
                '   <option value="68">Nosepick</option>' +
                '   <option value="69">Panic</option>' +
                '   <option value="70">Peer</option>' +
                '   <option value="71">Plead</option>' +
                '   <option value="72">Point</option>' +
                '   <option value="73">Poke</option>' +
                '   <option value="74">Pray</option>' +
                '   <option value="75">Roar</option>' +
                '   <option value="76">Rofl</option>' +
                '   <option value="77">Rude</option>' +
                '   <option value="78">Salute</option>' +
                '   <option value="79">Scratch</option>' +
                '   <option value="80">Sexy</option>' +
                '   <option value="81">Shake</option>' +
                '   <option value="82">Shout</option>' +
                '   <option value="83">Shrug</option>' +
                '   <option value="84">Shy</option>' +
                '   <option value="85">Sigh</option>' +
                '   <option value="86">Sit</option>' +
                '   <option value="87">Sleep</option>' +
                '   <option value="88">Snarl</option>' +
                '   <option value="89">Spit</option>' +
                '   <option value="90">Stare</option>' +
                '   <option value="91">Surprised</option>' +
                '   <option value="92">Surrender</option>' +
                '   <option value="93">Talk</option>' +
                '   <option value="94">Talk Exclamation</option>' +
                '   <option value="95">Talk Question</option>' +
                '   <option value="96">Tap</option>' +
                '   <option value="97">Thank</option>' +
                '   <option value="98">Threaten</option>' +
                '   <option value="99">Tired</option>' +
                '   <option value="100">Victory</option>' +
                '   <option value="101">Wave</option>' +
                '   <option value="102">Welcome</option>' +
                '   <option value="103">Whine</option>' +
                '   <option value="104">Whistle</option>' +
                '   <option value="105">Work</option>' +
                '   <option value="106">Yawn</option>' +
                '   <option value="107">Boggle</option>' +
                '   <option value="108">Calm</option>' +
                '   <option value="109">Cold</option>' +
                '   <option value="110">Comfort</option>' +
                '   <option value="111">Cuddle</option>' +
                '   <option value="112">Duck</option>' +
                '   <option value="113">Insult</option>' +
                '   <option value="114">Introduce</option>' +
                '   <option value="115">Jk</option>' +
                '   <option value="116">Lick</option>' +
                '   <option value="117">Listen</option>' +
                '   <option value="118">Lost</option>' +
                '   <option value="119">Mock</option>' +
                '   <option value="120">Ponder</option>' +
                '   <option value="121">Pounce</option>' +
                '   <option value="122">Praise</option>' +
                '   <option value="123">Purr</option>' +
                '   <option value="124">Puzzle</option>' +
                '   <option value="125">Raise</option>' +
                '   <option value="126">Ready</option>' +
                '   <option value="127">Shimmy</option>' +
                '   <option value="128">Shiver</option>' +
                '   <option value="129">Shoo</option>' +
                '   <option value="130">Slap</option>' +
                '   <option value="131">Smirk</option>' +
                '   <option value="132">Sniff</option>' +
                '   <option value="133">Snub</option>' +
                '   <option value="134">Soothe</option>' +
                '   <option value="135">Stink</option>' +
                '   <option value="136">Taunt</option>' +
                '   <option value="137">Tease</option>' +
                '   <option value="138">Thirsty</option>' +
                '   <option value="139">Veto</option>' +
                '   <option value="140">Snicker</option>' +
                '   <option value="141">Stand</option>' +
                '   <option value="142">Tickle</option>' +
                '   <option value="143">Violin</option>' +
                '   <option value="163">Smile</option>' +
                '   <option value="183">Rasp</option>' +
                '   <option value="203">Pity</option>' +
                '   <option value="204">Growl</option>' +
                '   <option value="205">Bark</option>' +
                '   <option value="223">Scared</option>' +
                '   <option value="224">Flop</option>' +
                '   <option value="225">Love</option>' +
                '   <option value="226">Moo</option>' +
                '   <option value="327">Open fire</option>' +
                '   <option value="328">Flirt</option>' +
                '   <option value="329">Joke</option>' +
                '   <option value="243">Command</option>' +
                '   <option value="363">Wink</option>' +
                '   <option value="364">Pat</option>' +
                '   <option value="365">Serious</option>' +
                '   <option value="366">Mount special</option>' +
                '   <option value="367">Goodluck</option>' +
                '   <option value="368">Blame</option>' +
                '   <option value="369">Blank</option>' +
                '   <option value="370">Brandish</option>' +
                '   <option value="371">Breath</option>' +
                '   <option value="372">Disagree</option>' +
                '   <option value="373">Doubt</option>' +
                '   <option value="374">Embarass</option>' +
                '   <option value="375">Encourage</option>' +
                '   <option value="376">Enemy</option>' +
                '   <option value="377">Eyebrow</option>' +
                '   <option value="378">Toast</option>' +
                '</select>';
        }

        function getHelloFilter(type, param)
        {
			return '<select class="form-control" id="'+type+'_param'+param+'_val">' +
                '   <option value="0">Always</option>' +
                '   <option value="1">OnGossipHello only</option>' +
                '   <option value="2">OnReportUse only</option>' +
                '</select>';
		}
		
        function getEmoteSelect(type, param)
        {
           return '<select class="form-control" id="'+type+'_param'+param+'_val">' +
                '   <option value="0">None</option>' +
                '   <option value="1">Start</option>' +
                '   <option value="2">Bow</option>' +
                '   <option value="3">Wave</option>' +
                '   <option value="4">Cheer</option>' +
                '   <option value="5">Exclamation</option>' +
                '   <option value="6">Question</option>' +
                '   <option value="7">Eat</option>' +
                '   <option value="11">Laugh</option>' +
                '   <option value="14">Rude</option>' +
                '   <option value="15">Roar</option>' +
                '   <option value="16">Kneel</option>' +
                '   <option value="17">Kiss</option>' +
                '   <option value="18">Cry</option>' +
                '   <option value="19">Chicken</option>' +
                '   <option value="20">Beg</option>' +
                '   <option value="21">Applaud</option>' +
                '   <option value="22">Shout</option>' +
                '   <option value="23">Flex</option>' +
                '   <option value="24">Shy</option>' +
                '   <option value="25">Point</option>' +
                '   <option value="33">Wound</option>' +
                '   <option value="34">Wound Critical</option>' +
                '   <option value="35">Attack Unarmed</option>' +
                '   <option value="36">Attack 1H</option>' +
                '   <option value="37">Attack 2H Tight</option>' +
                '   <option value="38">Attack 2H Loose</option>' +
                '   <option value="39">Parry Unarmed</option>' +
                '   <option value="43">Parry Shield</option>' +
                '   <option value="44">Ready Unarmed</option>' +
                '   <option value="45">Ready 1H</option>' +
                '   <option value="48">Ready Bow</option>' +
                '   <option value="50">Spell Precast</option>' +
                '   <option value="51">Spell Cast</option>' +
                '   <option value="53">Battle Roar</option>' +
                '   <option value="54">Special Attack 1H</option>' +
                '   <option value="60">Kick</option>' +
                '   <option value="61">Attack Thrown</option>' +
                '   <option value="66">Salute</option>' +
                '   <option value="70">Wave No Sheathe</option>' +
                '   <option value="71">Cheer No Sheathe</option>' +
                '   <option value="92">Eat No Sheathe</option>' +
                '   <option value="94">Dance</option>' +
                '   <option value="113">Salute No Sheathe</option>' +
                '   <option value="153">Laugh No Sheathe</option>' +
                '   <option value="253">Old Lift Off</option>' +
                '   <option value="254">Lift Off</option>' +
                '   <option value="273">Yes</option>' +
                '   <option value="274">No</option>' +
                '   <option value="275">Train</option>' +
                '   <option value="293">Land</option>' +
                '   <option value="374">Submerge</option>' +
                '   <option value="377">Mount Special</option>' +
                '   <option value="380">Fishing</option>' +
                '   <option value="381">Loot</option>' +
                '   <option value="387">Drown</option>' +
                '   <option value="388">Stomp</option>' +
                '   <option value="389">Attack Off</option>' +
                '   <option value="390">Attack Off Pierce</option>' +
                '   <option value="393">Creature Special</option>' +
                '   <option value="394">Jump Land Run</option>' +
                '   <option value="395">Jump End</option>' +
                '   <option value="396">Talk No Sheathe</option>' +
                '   <option value="397">Point No Sheathe</option>' +
                '   <option value="399">Jump Start</option>' +
                '   <option value="401">Dance Special</option>' +
                '   <option value="402">Custom Spell 01</option>' +
                '   <option value="403">Custom Spell 02</option>' +
                '   <option value="404">Custom Spell 03</option>' +
                '   <option value="405">Custom Spell 04</option>' +
                '   <option value="406">Custom Spell 05</option>' +
                '   <option value="407">Custom Spell 06</option>' +
                '   <option value="408">Custom Spell 07</option>' +
                '   <option value="409">Custom Spell 08</option>' +
                '   <option value="410">Custom Spell 09</option>' +
                '   <option value="411">Custom Spell 10</option>' +
                '</select>';
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
                url: '/creature/entry/' + id + '/name',
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
                url: '/gameobject/entry/' + id + '/name',
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
                url: '/test/quest/' + id + '/name',
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
        function Hex(d) {
            return (+d).toString(16).toUpperCase();
        }
        function selectByte(NPCFlags, Mask, Binary, child) {
            var select;
            if(child == 1)
                select = 'first-child';
            else
                select = 'nth-child('+child+')';

            var option = $(NPCFlags + ' > option:'+select).val();
            var flag = $(NPCFlags).val();
            if(flag == null)
                flag = [];
            
            if (Mask & Binary)
            {
                flag.push(option);
                $(NPCFlags + ' > option:'+select).attr('selected', 'selected');
            }
            else
            {
                var index = flag.indexOf(option);
                if (index > -1)
                    flag.splice(index, 1);
                $(NPCFlags + ' > option:'+select).removeAttr('selected');
            }
            $(NPCFlags).val(flag);
            $(NPCFlags).trigger("chosen:updated");
        }
        function generateBitComment(Start, Comment, Binary, Mask, String) {
            if (Mask & Binary) {
                if (Comment != Start)
                    Comment += ", " + String;
                else
                    Comment += String;
            }
            return Comment;
        }
        function setPhaseColor(Color, Mask, Binary, Phase) {
            if(Mask & Binary)
                Color.push(parseInt(Object.keys(PHASE)[Phase]));
        }
    }
})(jQuery);