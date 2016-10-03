(function($)
{
    /**
     * HOW TO ADD A EVENT_T_EVENT
     *  1. Add a new row in smartai_events
     *  2. Add a new case in the function generateEventComment()
     *  If your event requires a specific display:
     *  3. Add a new case in displayEventVal()
     * --
     * HOW TO ADD A EVENT_T_ACTION
     *  1. Add a new row in smartai_actions
     *  2. Add a new case in the function generateActionComment()
     *  If your action requires a specific display:
     *  3. Add a new case in displayActionVal()
     */
    $.fn.eventai=function(informations) {
        var Entry = informations.Entry;
        var Name = informations.Name;
        var Lines = informations.Lines;
        var Events = informations.Events;
        var Actions = informations.Actions;

        var Info = { "creature_id": Entry };

        function getMaxID(Lines)
        {
            if (jQuery.isEmptyObject(Lines))
                return Entry * 100;
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
        var Action1Type = $('#action1_type');
        var Action2Type = $('#action2_type');
        var Action3Type = $('#action3_type');

        var EventParam1 = $('#event_param1');
        var EventParam2 = $('#event_param2');
        var EventParam3 = $('#event_param3');
        var EventParam4 = $('#event_param4');
        var EventParam1DIV = EventParam1.next('div');
        var EventParam2DIV = EventParam2.next('div');
        var EventParam3DIV = EventParam3.next('div');
        var EventParam4DIV = EventParam4.next('div');

        var Action1Param1 = $('#action1_param1');
        var Action1Param2 = $('#action1_param2');
        var Action1Param3 = $('#action1_param3');
        var Action1Param1DIV = Action1Param1.next('div');
        var Action1Param2DIV = Action1Param2.next('div');
        var Action1Param3DIV = Action1Param3.next('div');
        var Action2Param1 = $('#action2_param1');
        var Action2Param2 = $('#action2_param2');
        var Action2Param3 = $('#action2_param3');
        var Action2Param1DIV = Action2Param1.next('div');
        var Action2Param2DIV = Action2Param2.next('div');
        var Action2Param3DIV = Action2Param3.next('div');
        var Action3Param1 = $('#action3_param1');
        var Action3Param2 = $('#action3_param2');
        var Action3Param3 = $('#action3_param3');
        var Action3Param1DIV = Action3Param1.next('div');
        var Action3Param2DIV = Action3Param2.next('div');
        var Action3Param3DIV = Action3Param3.next('div');

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
            if (Lines[id].event_inverse_phase_mask != "0") {
                var Binary = "0x" + Hex(Lines[id].event_inverse_phase_mask);
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
        updateChosen('#event_inverse_phase_mask_value', 'event_inverse_phase_mask');
        updateChosen('#event_flags_value', 'event_flags');
        updateChosen('#target_flags_value', 'target_flags');

        function generateComments(Lines) {
            for (var i in Lines) {
                var TR = $('td:first-child').filter(function() { return $.text([this]) == i; }).closest('tr');
                var ID = $('td:first-child').filter(function() { return $.text([this]) == i; }).closest('tr').find('> td:first-child').text();
                var Comment = Name + ' - ' + generateEventComment(ID) + ' - ' + generateActionComment(1, ID);
                if(Lines[ID].action2_type != 0)
                    Comment += " - " + generateActionComment(2, ID);
                if(Lines[ID].action3_type != 0)
                    Comment += " - " + generateActionComment(3, ID);
                Comment += " " + generateFlagsComment(ID) + generatePhaseComment(ID);
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
        $('#generate_sql').click(function () {
            generateComments(Lines);
            generateSQL(Lines);
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

        function generateSQL(Lines)
        {
            var SQL =
                "-- " + Name + " EventAI\n" +
                "SET @Entry = " + Entry +";\n" +
                "UPDATE creature_template SET AIName='EventAI', ScriptName='' WHERE entry = @Entry;\n" +
                "DELETE FROM creature_ai_scripts WHERE creature_id = @Entry;\n" +
                "INSERT INTO creature_ai_scripts (id, creature_id, event_type, event_inverse_phase_mask, event_chance, event_flags, event_param1, event_param2, event_param3, event_param4, action1_type, action1_param1, action1_param2, action1_param3, action2_type, action2_param1, action2_param2, action2_param3, action3_type, action3_param1, action3_param2, action3_param3, comment) VALUES\n";
            $.each(Object.keys(Lines), function(index, i) {
                SQL += "("+Lines[i].id+",\t@Entry,\t"+Lines[i].event_type+",\t"+Lines[i].event_inverse_phase_mask+",\t"+Lines[i].event_chance+",\t"+Lines[i].event_flags+",\t"+Lines[i].event_param1+",\t"+Lines[i].event_param2+",\t"+Lines[i].event_param3+",\t"+Lines[i].event_param4+",\t"+Lines[i].action1_type+",\t"+Lines[i].action1_param1+",\t"+Lines[i].action1_param2+",\t"+Lines[i].action1_param3+",\t"+Lines[i].action2_type+",\t"+Lines[i].action2_param1+",\t"+Lines[i].action2_param2 +",\t"+Lines[i].action2_param3 +",\t"+Lines[i].action3_type+",\t"+Lines[i].action3_param1+",\t"+Lines[i].action3_param2+",\t"+Lines[i].action3_param3+",\t\""+Lines[i].comment.replace(/'/g, '\'').toString()+"\"),\n";
            });
            SQL = SQL.slice(0, -2);
            SQL += ";";
            console.log(SQL);
            return SQL;
        }

        function generateData(Lines) {
            var Data = [];
            $.each(Object.keys(Lines), function(index, i) {
                Data.push([
                    Lines[i].id,
                    Lines[i].event_type,
                    Lines[i].event_inverse_phase_mask,
                    Lines[i].event_chance,
                    Lines[i].event_flags,
                    Lines[i].event_param1,
                    Lines[i].event_param2,
                    Lines[i].event_param3,
                    Lines[i].event_param4,
                    Lines[i].action1_type,
                    Lines[i].action1_param1,
                    Lines[i].action1_param2,
                    Lines[i].action1_param3,
                    Lines[i].action2_type,
                    Lines[i].action2_param1,
                    Lines[i].action2_param2,
                    Lines[i].action2_param3,
                    Lines[i].action3_type,
                    Lines[i].action3_param1,
                    Lines[i].action3_param2,
                    Lines[i].action3_param3,
                    Lines[i].comment.replace(/'/g, '"').toString()
                ]);
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
            Return = generateBitComment('(', Return, Binary, 0x1, 'Repeatable');
            Return = generateBitComment('(', Return, Binary, 0x20, 'Random Action');
            Return = generateBitComment('(', Return, Binary, 0x80, 'Debug');
            Return += ")";
            if (Return == "()")
                return "";
            return replaceComma(Return);
        }
        function getPhaseColorComment(Color, String, Mask, Binary, Phase) {
            var Return = { "string": String };
            if (Mask & Binary) {
                Color.push(parseInt(Object.keys(PHASE)[Phase]));
                if (Return.string != "(Not In ")
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
            if (Lines[id].event_inverse_phase_mask == "0") {
                TR.css('background-color', 'none');
                return "";
            }
            var Binary = "0x" + Hex(Lines[id].event_inverse_phase_mask);
            var Return = "(Not In ";
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
            if(Return == "(Not In )")
                return '';
            else
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
                    break;
                case "1":
                    return "Out of Combat";
                    break;
                case "2":
                    return "Between " + EventParam2 + "-" + EventParam1 + "% HP";
                    break;
                case "3":
                    return "Between " + EventParam2 + "-" + EventParam1 + "% MP";
                    break;
                case "4":
                    return "On Aggro";
                    break;
                case "5":
                    if (EventParam3 >= "0")
                        return "On '<a href='https://db.valkyrie-wow.org/?npc=" + EventParam3 + "'>" + getCreatureName(EventParam3) + "</a>' Killed";
                    else
                        return "On Killed Unit";
                    break;
                case "6":
                    return "On Death";
                    break;
                case "7":
                    return "On Evade";
                    break;
                case "8":
                    if(EventParam1 > "0" && EventParam2 == "0")
                        return "On Spellhit '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    else if(EventParam1 == "0" && EventParam2 >= "0")
                        return "On Spell School Hit'";
                    else
                        return "On Spellhit";
                    break;
                case "9":
                    return "Within " + EventParam1 + "-" + EventParam2 + " Range";
                    break;
                case "10":
                    return "Within " + EventParam1 + "-" + EventParam2 + " Range OOC LoS";
                    break;
                case "11":
                    return "On Respawn";
                    break;
                case "12":
                    return "Target Between " + EventParam1 + "-" + EventParam2 + "% HP";
                    break;
                case "13":
                    return "On Victim Casting '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    break;
                case "14":
                    return "On Friendly at '" + EventParam1 + "' HP";
                    break;
                case "15":
                    return "On Friendly CCed";
                    break;
                case "16":
                    return "On Friendly Missing Buff '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    break;
                case "17":
                    return "On Summon '<a href='https://db.valkyrie-wow.org/?npc=" + EventParam1 + "'>" + getCreatureName(EventParam1) + "</a>'";
                    break;
                case "18":
                    return "Target Between " + EventParam1 + "-" + EventParam2 + "% MP";
                    break;
                case "21":
                    return "On Reached Home";
                    break;
                case "22":
                    return "On Received Emote " + EventParam1;
                    break;
                case "23":
                    return "On Has Aura '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    break;
                case "24":
                    if (EventParam2 > "0")
                        return "On Target Buffed With '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    else if (EventParam2 == "0")
                        return "On Target Missing Aura '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    else {
                        alert("Error:\nLine " + id + ": 'Stacks' is negative.");
                        return "Error: Param2 is negative";
                    }
                    break;
                case "25":
                    return "On Reset";
                    break;
                case "26":
                    if(EventParam1 > "0")
                        return "On '<a href='https://db.valkyrie-wow.org/?npc=" + EventParam1 + "'>" + getCreatureName(EventParam1) + "</a>' Despawn";
                    else
                        return "On Summoned Creatures Despawn";
                    break;
                case "27":
                    return "On Missing Buff '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    break;
                case "28":
                    return "On Target Missing Aura '<a href='https://db.valkyrie-wow.org/?spell=" + EventParam1 + "'>" + getSpellName(EventParam1) + "</a>'";
                    break;
                case "29":
                    return "On Update";
                    break;
                case "30":
                    return "On Received AI Event";
                    break;
                case "31":
                    return "On Energy Between " + EventParam2 + " and " + EventParam1;
                    break;
            }
        }
        function generateActionComment(type, id) {
            var ActionParam1 = Lines[id]['action'+type+'_param1'];
            var ActionParam2 = Lines[id]['action'+type+'_param2'];
            var ActionParam3 = Lines[id]['action'+type+'_param3'];
            switch (Lines[id]['action'+type+'_type']) {
                case "0":
                    return "No Action Type";
                    break;
                case "1":
                    if(ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0")
                        return "Say Line " + ActionParam1;
                    else if(ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0")
                        return "Say Line " + ActionParam1 + " or " + ActionParam2;
                    else if(ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0")
                        return "Say Line " + ActionParam1 + " or " + ActionParam2 + " or " + ActionParam3;
                    else {
                        alert("Error:\nLine " + id + ": something is wrong with Action #" + type);
                        return "Error";
                    }
                    break;
                case "2":
                    return "Set Faction " + ActionParam1;
                    break;
                case "3":
                    if(ActionParam1 != "0" && ActionParam2 == "0")
                        return "Morph To '<a href='https://db.valkyrie-wow.org/?npc=" + EventParam1 + "'>" + getCreatureName(EventParam1) + "</a>'";
                    else if(ActionParam1 == "0" && ActionParam2 != "0")
                        return "Morph To Modelid " + ActionParam2;
                    else {
                        alert("Error:\nLine " + id + ": something is wrong with Action #" + type);
                        return "Error";
                    }
                    break;
                case "4":
                    return "Play Sound " + ActionParam1;
                    break;
                case "5":
                    return "Play Emote " + ActionParam1;
                    break;
                case "6":
                    return "Fail Quest '<a href='https://db.valkyrie-wow.org/?quest=" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "7":
                    return "Add Quest 'https://db.valkyrie-wow.org/?quest=" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "9":
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0")
                        return "Play Random Sound (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0")
                        return "Play Random Sound (" + ActionParam1 + "&" + ActionParam2 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0") {
                        alert("Error:\nLine " + id + ": 'Sound id 2' should not be 0.");
                        return "Error";
                    } else if (ActionParam1 == "0" && ActionParam2 == "0" && ActionParam3 == "0") {
                        alert("Error:\nLine " + id + ": 'Sound id 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "10":
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0")
                        return "Play Random Emote (" + ActionParam1 + "," + ActionParam2 + "," + ActionParam3 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0")
                        return "Play Random Emote (" + ActionParam1 + "&" + ActionParam2 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0") {
                        alert("Error:\nLine " + id + ": 'Emote id 2' should not be 0.");
                        return "Error";
                    } else if (ActionParam1 == "0" && ActionParam2 == "0" && ActionParam3 == "0") {
                        alert("Error:\nLine " + id + ": 'Emote id 1 & 2' should not be 0.");
                        return "Error";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "11":
                    return "Cast '<a href='https://db.valkyrie-wow.org/?spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                    break;
                case "12":
                    return "Summon '<a href='https://db.valkyrie-wow.org/?npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
                    break;
                case "13":
                    if (ActionParam1 > "0") {
                        return "Increase Target Threat By " + ActionParam1 + "%";
                    } else if (ActionParam1 == "-100") {
                        return "Reset Target Threat";
                    } else if (ActionParam1 < "0") {
                        return "Decrease Target Threat By " + ActionParam1 + "%";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "14":
                    if (ActionParam1 > "0") {
                        return "Increase Threatlist By " + ActionParam1 + "%";
                    } else if (ActionParam1 == "-100") {
                        return "Reset Threatlist";
                    } else if (ActionParam1 < "0") {
                        return "Decrease Threatlist By " + ActionParam1 + "%";
                    } else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "15":
                    return "Quest Credit ''<a href='https://db.valkyrie-wow.org/?quest" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "16":
                    return "Summon '<a href='https://db.valkyrie-wow.org/?npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>' with '<a href='https://db.valkyrie-wow.org/?spell=" + ActionParam2 + "'>" + getSpellName(ActionParam2) + "</a>'";
                    break;
                case "17":
                    return "Set Unit Field " + ActionParam1 + " to " + ActionParam2;
                    break;
                case "18":
                    var Comment = "Set Unit Flag ";
                    var Binary = "0x" + Hex(ActionParam1);
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x1, 'Server Controlled');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x2, 'Non Attackable');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x4, 'Remove Client Control');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x8, 'Player Controlled');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x10, 'Rename');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x20, 'Resting');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x40, 'Unknown 6');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x80, 'Not Atackable 1');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x100, 'Immune to PC');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x200, 'Immune to NPC');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x400, 'Looting');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x800, 'Pet In Combat');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x1000, 'PvP');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x2000, 'Silenced');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x4000, 'Cannot Swim');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x8000, 'Only Swim');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x10000, 'Unknown 16');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x20000, 'Pacified');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x40000, 'Stunned');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x80000, 'In Combat');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x100000, 'Taxi Flight');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x200000, 'Disarmed');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x400000, 'Confused');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x800000, 'Fleeing');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x1000000, 'Possessed By Player');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x2000000, 'Not Selectable');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x4000000, 'Skinnable');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x8000000, 'Auras Visible');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x10000000, 'Unknown 28');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x20000000, 'Feign Death');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x40000000, 'Sheathe');
                    Comment = generateBitComment('Set Unit Flag ', Comment, Binary, 0x80000000, 'Mount');
                    return replaceComma(Comment);
                    break;
                case "19":
                    var Comment = "Remove Unit Flag ";
                    var Binary = "0x" + Hex(ActionParam1);
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x1, 'Server Controlled');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x2, 'Non Attackable');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x4, 'Remove Client Control');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x8, 'Player Controlled');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x10, 'Rename');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x20, 'Resting');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x40, 'Unknown 6');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x80, 'Not Atackable 1');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x100, 'Immune to PC');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x200, 'Immune to NPC');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x400, 'Looting');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x800, 'Pet In Combat');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x1000, 'PvP');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x2000, 'Silenced');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x4000, 'Cannot Swim');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x8000, 'Only Swim');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x10000, 'Unknown 16');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x20000, 'Pacified');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x40000, 'Stunned');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x80000, 'In Combat');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x100000, 'Taxi Flight');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x200000, 'Disarmed');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x400000, 'Confused');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x800000, 'Fleeing');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x1000000, 'Possessed By Player');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x2000000, 'Not Selectable');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x4000000, 'Skinnable');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x8000000, 'Auras Visible');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x10000000, 'Unknown 28');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x20000000, 'Feign Death');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x40000000, 'Sheathe');
                    Comment = generateBitComment('Remove Unit Flag ', Comment, Binary, 0x80000000, 'Mount');
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
                    if(ActionParam1 >= "0" && ActionParam1 <= "31")
                        return "Set Event Phase " + ActionParam1;
                    else {
                        alert("Error:\nLine " + id + ": Phase must be between 0 and 31.");
                        return "Error";
                    }
                    break;
                case "23":
                    if (ActionParam1 > 0 && ActionParam1 <= 31)
                        return "Increase Phase By " + ActionParam1;
                    else if (ActionParam1 < 0 && ActionParam1 >= -31)
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
                    return "Quest Credit '<a href='https://db.valkyrie-wow.org/?quest=" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "27":
                    return "Quest Credit '<a href='https://db.valkyrie-wow.org/?quest=" + ActionParam1 + "'>" + getQuestName(ActionParam1) + "</a>'";
                    break;
                case "28":
                    return "Remove Aura '<a href='https://db.valkyrie-wow.org/?spell=" + ActionParam1 + "'>" + getSpellName(ActionParam1) + "</a>'";
                    break;
                case "29":
                    return "Follow Target";
                    break;
                case "30":
                    if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 != "0")
                        return "Set Random Phase (" + ActionParam1 + ", " + ActionParam2 + ", " + ActionParam3 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 != "0" && ActionParam3 == "0")
                        return "Set Random Phase (" + ActionParam1 + " and " + ActionParam2 + ")";
                    else if (ActionParam1 != "0" && ActionParam2 == "0" && ActionParam3 == "0") {
                        alert("Error:\nLine " + id + ": 'Phase index 2' should not be 0.");
                        return "Error";
                    } else if (ActionParam1 == "0" && ActionParam2 == "0" && ActionParam3 == "0") {
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
                    return "Summon '<a href='https://db.valkyrie-wow.org/?npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
                    break;
                case "33":
                    return "Quest Credit '<a href='https://db.valkyrie-wow.org/?quest=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
                    break;
                case "34":
                    return "Set Instance Data " + ActionParam1 + " " + ActionParam2;
                    break;
                case "35":
                    return "Set Instance Data " + ActionParam1 + " " + ActionParam2;
                    break;
                case "36":
                    return "Update Template To '<a href='https://db.valkyrie-wow.org/?npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
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
                    else if (ActionParam1 != "0" && ActionParam2 == "1")
                        return "Set Invincibility At " + ActionParam1 + "% HP";
                    else if (ActionParam1 == "0")
                        return "Remove Invincibility";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "43":
                    if (ActionParam1 != "0" && ActionParam2 == "0")
                        return "Mount To Creature '<a href='https://db.valkyrie-wow.org/?npc=" + ActionParam1 + "'>" + getCreatureName(ActionParam1) + "</a>'";
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
                    return "Say Text " + ActionParam2 + " at " + ActionParam1 + "%";
                    break;
                case "45":
                    return "Throw AIEvent #" + ActionParam1 + " at " + ActionParam2 + "m";
                    break;
                case "46":
                    return "Throw AIEvent Mask";
                    break;
                case "47":
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
                        default: return "Error";
                    }
                    break;
                case "48":
                    switch (ActionParam1) {
                        case "0": return "Set Idle"; break;
                        case "1": return "Set Random Movement In " + ActionParam2 + "m Radius"; break;
                        case "2": return "Set Waypoint"; break;
                        default: return "Error";
                    }
                    break;
                case "49":
                    if (ActionParam1 == "0")
                        return "Set Dynamic Movement Off";
                    else if (ActionParam1 == "1")
                        return "Set Dynamic Movement On";
                    else {
                        alert("Error:\nLine " + id + ": something is wrong.");
                        return "Error";
                    }
                    break;
                case "50":
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
                '<td>' + Events[Lines[id].event_type].name.slice(6) + '</td>' +
                '<td>' + Actions[Lines[id].action1_type].name.slice(7) + '</td>' +
                '<td>' + Actions[Lines[id].action2_type].name.slice(7) + '</td>' +
                '<td>' + Actions[Lines[id].action3_type].name.slice(7) + '</td>' +
                '<td>' + Lines[id].comment + '</td>' +
                '<td class="options">' +
                '   <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' +
                '   <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                '</td>' +
                '</tr>').appendTo('table > tbody');
            Lines[MaxID] = {
                "creature_id": Entry.toString(),
                "id": MaxID.toString(),
                "comment": Lines[id].comment,
                "event_type": Lines[id].event_type,
                "event_chance": Lines[id].event_chance,
                "event_inverse_phase_mask": Lines[id].event_inverse_phase_mask,
                "event_flags": Lines[id].event_flags,
                "event_param1": Lines[id].event_param1,
                "event_param2": Lines[id].event_param2,
                "event_param3":Lines[id].event_param3,
                "event_param4": Lines[id].event_param4,
                "action1_type": Lines[id].action1_type,
                "action1_param1": Lines[id].action1_param1,
                "action1_param2": Lines[id].action1_param2,
                "action1_param3": Lines[id].action1_param3,
                "action2_type": Lines[id].action2_type,
                "action2_param1": Lines[id].action2_param1,
                "action2_param2": Lines[id].action2_param2,
                "action2_param3": Lines[id].action2_param3,
                "action3_type": Lines[id].action3_type,
                "action3_param1": Lines[id].action3_param1,
                "action3_param2": Lines[id].action3_param2,
                "action3_param3": Lines[id].action3_param3
            };
            displayLine(MaxID, $('table > tbody > tr:has(td:first-child:contains("' + MaxID + '"))'));
            RefreshTable();
        }
        function addLine() {
            MaxID++;
            $('<tr>' +
                '<td><strong>' + MaxID + '</strong></td>' +
                '<td>' + Events[0].name.slice(6) + '</td>' +
                '<td>' + Actions[0].name.slice(7) + '</td>' +
                '<td>' + Actions[0].name.slice(7) + '</td>' +
                '<td>' + Actions[0].name.slice(7) + '</td>' +
                '<td>' + Name + ' -</td>' +
                '<td class="options">' +
                '   <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' +
                '   <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                '</td>' +
                '</tr>').appendTo('table > tbody');
            Lines[MaxID] = {
                "creature_id": Entry.toString,
                "id": MaxID.toString(),
                "comment": '"' + Name + ' -"',
                "event_type": "0",
                "event_chance": "100",
                "event_inverse_phase_mask": "0",
                "event_flags": "0",
                "event_param1": "0",
                "event_param2": "0",
                "event_param3": "0",
                "event_param4": "0",
                "action1_type": "0",
                "action1_param1": "0",
                "action1_param2": "0",
                "action1_param3": "0",
                "action2_type": "0",
                "action2_param1": "0",
                "action2_param2": "0",
                "action2_param3": "0",
                "action3_type": "0",
                "action3_param1": "0",
                "action3_param2": "0",
                "action3_param3": "0"
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
            displayEventVal(Lines[id].event_type, id);
            displayActionVal(1, Lines[id].action1_type, id);
            displayActionVal(2, Lines[id].action2_type, id);
            displayActionVal(3, Lines[id].action3_type, id);

            // Params Names
            changeEventsParams(Lines[id]);
            changeActionsParams(1, Lines[id]);
            changeActionsParams(2, Lines[id]);
            changeActionsParams(3, Lines[id]);


            var SelectFlags = '#event_flags_value';
            var SelectPhase = '#event_inverse_phase_mask_value';
            var SelectTargetFlags = '#target_flags_value';

            if (Lines[id].event_flags != "0") {
                var Binary = "0x" + Hex(Lines[id].event_flags);
                selectByte(SelectFlags, 0x1, Binary, 1);
                selectByte(SelectFlags, 0x2, Binary, 2);
                selectByte(SelectFlags, 0x4, Binary, 3);
                selectByte(SelectFlags, 0x8, Binary, 4);
                selectByte(SelectFlags, 0x10, Binary, 5);
                selectByte(SelectFlags, 0x20, Binary, 6);
            } else {
                $(SelectFlags + ' > option').removeAttr('selected');
            }
            if (Lines[id].event_inverse_phase_mask != "0") {
                Binary = "0x" + Hex(Lines[id].event_inverse_phase_mask);
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
            Action1Type.val(Lines[id].action1_type).trigger('chosen:updated');
            Action2Type.val(Lines[id].action2_type).trigger('chosen:updated');
            Action3Type.val(Lines[id].action3_type).trigger('chosen:updated');
        }

        function displayEventVal(EventType, id) {
            switch (EventType) {
                case "8":
                    displayEventValDefault(1, id);
                    EventParam2DIV.empty();
                    $('<select multiple class="form-control spell_flags" id="event_param2_val">' +
                        '   <option value="1">NORMAL</option>' +
                        '   <option value="2">HOLY</option>' +
                        '   <option value="4">FIRE</option>' +
                        '   <option value="8">NATURE</option>' +
                        '   <option value="16">FROST</option>' +
                        '   <option value="32">SHADOW</option>' +
                        '   <option value="64">ARCANE</option>' +
                        '</select>').appendTo(EventParam2DIV);
                    $('#event_param2_val').val(Lines[id].event_param2);
                    var NPCFlags = '#event_param2_val';
                    var Binary = "0x" + Hex(Lines[id].event_param2);
                    selectByte(NPCFlags, 0x1, Binary, 1);
                    selectByte(NPCFlags, 0x2, Binary, 2);
                    selectByte(NPCFlags, 0x4, Binary, 3);
                    selectByte(NPCFlags, 0x8, Binary, 4);
                    selectByte(NPCFlags, 0x10, Binary, 5);
                    selectByte(NPCFlags, 0x20, Binary, 6);
                    selectByte(NPCFlags, 0x40, Binary, 7);
                    displayEventValDefault(3, id);
                    displayEventValDefault(4, id);
                    break;
                case "10":
                    EventParam1DIV.empty();
                    $('<select class="form-control" id="event_param1_val">' +
                        '   <option value="0">Yes</option>' +
                        '   <option value="1">No</option>' +
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
                case "30":
                    EventParam1DIV.empty();
                    $('<select class="form-control" id="event_param1_val">' +
                        '   <option value="0">Yes</option>' +
                        '   <option value="1">No</option>' +
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
        function displayActionVal(Type, ActionType, id) {
            var Param1;
            var Param2;
            var Param3;
            switch(Type)
            {
                case 1:
                    Param1 = Action1Param1DIV;
                    Param2 = Action1Param2DIV;
                    Param3 = Action1Param3DIV;
                    break;
                case 2:
                    Param1 = Action2Param1DIV;
                    Param2 = Action2Param2DIV;
                    Param3 = Action2Param3DIV;
                    break;
                case 3:
                    Param1 = Action3Param1DIV;
                    Param2 = Action3Param2DIV;
                    Param3 = Action3Param3DIV;
                    break;
                default: return;
            }
            switch (ActionType) {
                case "2": // ACTION_SET_FACTION
                    displayActionValDefault(Type, 1, id);
                    Param2.empty();
                    $('<select multiple class="form-control spell_flags" id="action'+Type+'_param2_val">' +
                        '   <option value="0">TEMPFACTION_NONE</option>' +
                        '   <option value="1">TEMPFACTION_RESTORE_RESPAWN</option>' +
                        '   <option value="2">TEMPFACTION_RESTORE_COMBAT_STOP</option>' +
                        '   <option value="4">TEMPFACTION_RESTORE_REACH_HOME</option>' +
                        '</select>').appendTo(Param2);
                    var Flags = '#action'+Type+'_param2_val';
                    var Binary = "0x" + Hex(Lines[id]['action'+Type+'_param2']);
                    if (Lines[id]['action'+Type+'_param2'] == "0") {
                        $(Flags + ' > option:first-child').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:first-child').removeAttr('selected');
                    }
                    selectByte(Flags, 0x1, Binary, 2);
                    selectByte(Flags, 0x2, Binary, 3);
                    selectByte(Flags, 0x4, Binary, 4);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "5":
                    Param1.empty();
                    $(getEmoteSelect('action', 1)).appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "10":
                    Param1.empty();
                    $(getEmoteSelect('action', 1)).appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    Param2.empty();
                    $(getEmoteSelect('action', 2)).appendTo(Param2);
                    $('#action'+Type+'_param2_val').val(Lines[id]['action'+Type+'_param2']);
                    Param3.empty();
                    $(getEmoteSelect('action', 3)).appendTo(Param3);
                    $('#action'+Type+'_param3_val').val(Lines[id]['action'+Type+'_param3']);
                    break;
                case "11": //ACTION_CAST
                    displayActionValDefault(Type, 1, id);
                    displayTargetSelect(id, Type, Param2, 2);
                    Param3.empty();
                    $('<select multiple class="form-control spell_flags" id="action'+Type+'_param3_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">INTERRUPT_PREVIOUS</option>' +
                        '   <option value="2">TRIGGERED</option>' +
                        '   <option value="4">FORCE_CAST</option>' +
                        '   <option value="8">CAST_NO_MELEE_IF_OOM</option>' +
                        '   <option value="16">CAST_FORCE_TARGET_SELF</option>' +
                        '   <option value="32">AURA_NOT_PRESENT</option>' +
                        '</select>').appendTo(Param3);
                    var Flags = '#action'+Type+'_param3_val';
                    var Binary = "0x" + Hex(Lines[id]['action'+Type+'_param3']);
                    if (Lines[id]['action'+Type+'_param3'] == "0") {
                        $(Flags + ' > option:first-child').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:first-child').removeAttr('selected');
                    }
                    selectByte(Flags, 0x1, Binary, 2);
                    selectByte(Flags, 0x2, Binary, 3);
                    selectByte(Flags, 0x20, Binary, 4);
                    selectByte(Flags, 0x40, Binary, 5);
                    break;
                case "12": // ACTION_SUMMON
                case "13": // ACTION_THREAT_SINGLE_PCT
                case "15": // ACTION_QUEST_EVENT
                case "32": // ACTION_SUMMON
                case "33": // ACTION_KILLED_MONSTER
                case "35": // ACTION_SET_INST_DATA64
                    displayActionValDefault(Type, 1, id);
                    displayTargetSelect(id, Type, Param2, 2);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "16": // ACTION_CASTCREATUREGO
                case "17": // ACTION_SET_UNIT_FIELD
                    displayActionValDefault(Type, 1, id);
                    displayActionValDefault(Type, 2, id);
                    displayTargetSelect(id, Type, Param3, 3);
                    break;
                case "18": // ACTION_SET_UNIT_FLAG
                case "19": // ACTION_REMOVE_UNIT_FLAG
                    Param1.empty();
                    $('<select multiple class="form-control npc_flags" id="action'+Type+'_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">SERVER_CONTROLLED</option>' +
                        '   <option value="2">NON_ATTACKABLE</option>' +
                        '   <option value="4">REMOVE_CLIENT_CONTROL</option>' +
                        '   <option value="8">PLAYER_CONTROLLED</option>' +
                        '   <option value="16">RENAME</option>' +
                        '   <option value="32">RESTING</option>' +
                        '   <option value="64">UNK_6</option>' +
                        '   <option value="128">NOT_ATTACKABLE_1</option>' +
                        '   <option value="256">IMMUNE_TO_PC</option>' +
                        '   <option value="512">IMMUNE_TO_NPC</option>' +
                        '   <option value="1024">LOOTING</option>' +
                        '   <option value="2048">PET_IN_COMBAT</option>' +
                        '   <option value="4096">PVP</option>' +
                        '   <option value="8192">SILENCED</option>' +
                        '   <option value="16384">CANNOT_SWIM</option>' +
                        '   <option value="32768">ONLY_SWIM</option>' +
                        '   <option value="65536">UNK_16</option>' +
                        '   <option value="131072">PACIFIED</option>' +
                        '   <option value="262144">STUNNED</option>' +
                        '   <option value="524288">IN_COMBAT</option>' +
                        '   <option value="1048576">TAXI_FLIGHT</option>' +
                        '   <option value="2097152">DISARMED</option>' +
                        '   <option value="4194304">CONFUSED</option>' +
                        '   <option value="8388608">FLEEING</option>' +
                        '   <option value="16777216">POSSESSED_BY_PLAYER</option>' + //25
                        '   <option value="33554432">NOT_SELECTABLE</option>' +
                        '   <option value="67108864">SKINNABLE</option>' +
                        '   <option value="134217728">AURAS_VISIBLE</option>' +
                        '   <option value="268435456">UNK_28</option>' +
                        '   <option value="536870912">FEING_DEATH</option>' +
                        '   <option value="1073741824">SHEATHE</option>' +
                        '   <option value="2147483648">MOUNT</option>' +
                        '</select>').appendTo(Param1);
                    var NPCFlags = '#action'+Type+'_param1_val';
                    var Binary = "0x" + Hex(Lines[id]['action'+Type+'_param1']);
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
                    displayTargetSelect(id, Type, Param2, 2);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "20":
                    Param1.empty();
                    $('<select class="form-control" id="action'+Type+'_param1_val">' +
                        '   <option value="0">Stop</option>' +
                        '   <option value="1">Start</option>' +
                        '</select>').appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "21":
                    Param1.empty();
                    $('<select class="form-control" id="action'+Type+'_param1_val">' +
                        '   <option value="0">Disable</option>' +
                        '   <option value="1">Enable</option>' +
                        '</select>').appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "26":
                    displayActionValDefault(Type, 1, id);
                    Param2.empty();
                    $('<select class="form-control" id="action'+Type+'_param2_val">' +
                        '   <option value="0">No</option>' +
                        '   <option value="1">Yes</option>' +
                        '</select>').appendTo(Param2);
                    $('#action'+Type+'_param2_val').val(Lines[id]['action'+Type+'_param2']);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "28":
                    displayTargetSelect(id, Type, Param1, 1);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "34": // ACTION_SET_INST_DATA
                    displayActionValDefault(Type, 1, id);
                    Param2.empty();
                    $('<select class="form-control" id="action'+Type+'_param2_val">' +
                        '   <option value="0">NOT_STARTED</option>' +
                        '   <option value="1">IN_PROGRESS</option>' +
                        '   <option value="2">FAIL</option>' +
                        '   <option value="3">DONE</option>' +
                        '   <option value="4">SPECIAL</option>' +
                        '</select>').appendTo(Param2);
                    $('#action'+Type+'_param2_val').val(Lines[id]['action'+Type+'_param2']);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "36": // ACTION_UPDATE_TEMPLATE
                    displayActionValDefault(Type, 1, id);
                    Param2.empty();
                    $('<select class="form-control" id="action'+Type+'_param2_val">' +
                        '   <option value="0">ALLIANCE</option>' +
                        '   <option value="1">HORDE</option>' +
                        '</select>').appendTo(Param2);
                    $('#action'+Type+'_param2_val').val(Lines[id]['action'+Type+'_param2']);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "40": // ACTION_SET_SHEATH
                    Param1.empty();
                    $('<select class="form-control" id="action'+Type+'_param1_val">' +
                        '   <option value="0">Unarmed</option>' +
                        '   <option value="1">Melee</option>' +
                        '   <option value="1">Ranged</option>' +
                        '</select>').appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "42": // SET_INVINCIBILITY_HP_LEVEL
                    displayActionValDefault(Type, 2, id);
                    Param2.empty();
                    $('<select class="form-control" id="action'+Type+'_param2_val">' +
                        '   <option value="0">HP VALUE</option>' +
                        '   <option value="1">HP PERCENTAGE</option>' +
                        '</select>').appendTo(Param2);
                    $('#action'+Type+'_param2_val').val(Lines[id]['action'+Type+'_param2']);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "46": // ACTION_SET_THROW_MASK
                    Param1.empty();
                    $('<select multiple class="form-control spell_flags" id="action'+Type+'_param1_val">' +
                        '   <option value="0">NONE</option>' +
                        '   <option value="1">AI_EVENT_JUST_DIED</option>' +
                        '   <option value="2">AI_EVENT_CRITICAL_HEALTH</option>' +
                        '   <option value="4">AI_EVENT_LOST_HEALTH</option>' +
                        '   <option value="8">AI_EVENT_LOST_SOME_HEALTH</option>' +
                        '   <option value="16">AI_EVENT_GOT_FULL_HEALTH</option>' +
                        '</select>').appendTo(Param1);
                    var Flags = '#action'+Type+'_param1_val';
                    var Binary = "0x" + Hex(Lines[id]['action'+Type+'_param1']);
                    if (Lines[id]['action'+Type+'_param1'] == "0") {
                        $(Flags + ' > option:first-child').attr('selected', 'selected');
                    } else {
                        $(Flags + ' > option:first-child').removeAttr('selected');
                    }
                    selectByte(Flags, 0x1, Binary, 2);
                    selectByte(Flags, 0x2, Binary, 3);
                    selectByte(Flags, 0x4, Binary, 4);
                    selectByte(Flags, 0x8, Binary, 5);
                    selectByte(Flags, 0x10, Binary, 6);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "47": // ACTION_SET_SHEATH
                    Param1.empty();
                    $('<select class="form-control" id="action'+Type+'_param1_val">' +
                        '   <option value="0">STAND</option>' +
                        '   <option value="1">SIT</option>' +
                        '   <option value="2">SIT_CHAIR</option>' +
                        '   <option value="3">SLEEP</option>' +
                        '   <option value="4">SIT_LOW_CHAIR</option>' +
                        '   <option value="5">SIT_MEDIUM_CHAIR</option>' +
                        '   <option value="6">SIT_HIGH_CHAIR</option>' +
                        '   <option value="7">DEAD</option>' +
                        '   <option value="8">KNEEL</option>' +
                        '</select>').appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "48": // ACTION_SET_CHANGE_MOVEMENT
                    Param1.empty();
                    $('<select class="form-control" id="action'+Type+'_param1_val">' +
                        '   <option value="0">IDLE</option>' +
                        '   <option value="1">RANDOM</option>' +
                        '   <option value="2">WAYPOINT</option>' +
                        '</select>').appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "49": // ACTION_SET_DYNAMIC_MOVEMENT
                    Param1.empty();
                    $('<select class="form-control" id="action'+Type+'_param1_val">' +
                        '   <option value="0">OFF</option>' +
                        '   <option value="1">ON</option>' +
                        '</select>').appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                case "50":
                    Param1.empty();
                    $('<select class="form-control" id="action'+Type+'_param1_val">' +
                        '   <option value="0">Passive</option>' +
                        '   <option value="1">Defensive</option>' +
                        '   <option value="2">Aggressive</option>' +
                        '</select>').appendTo(Param1);
                    $('#action'+Type+'_param1_val').val(Lines[id]['action'+Type+'_param1']);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
                    break;
                default:
                    displayActionValDefault(Type, 1, id);
                    displayActionValDefault(Type, 2, id);
                    displayActionValDefault(Type, 3, id);
            }
        }
        function displayTargetSelect(ID, Type, Param, id)
        {
            Param.empty();
            $('<select class="form-control" id="action'+Type+'_param'+id+'_val">' +
                '   <option value="0">Self</option>' +
                '   <option value="1">Victim</option>' +
                '   <option value="2">Hostile Second Aggro</option>' +
                '   <option value="3">Hostile Last Aggro</option>' +
                '   <option value="4">Hostile Random</option>' +
                '   <option value="5">Hostile Random Not Top</option>' +
                '   <option value="6">Action Invoker</option>' +
                '   <option value="7">Action Invoker Owner</option>' +
                '   <option value="8">Hostile Random Player</option>' +
                '   <option value="9">Hostile Random Player Not Top</option>' +
                '   <option value="10">Sender</option>' +
                '</select>').appendTo(Param);
            $('#action'+Type+'_param'+id+'_val').val(Lines[ID]['action'+Type+'_param'+id]+'');
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
        function displayActionValDefault(type, param, id) {
            var ActionParam = $('#action' + type + '_param' + param);
            var ActionParamDIV = ActionParam.next('div');
            var attr = 'action' + type + '_param' + param;
            ActionParam.removeClass('display_flags');
            ActionParamDIV.empty();
            $('<input class="form-control" type="text" id="action' + type + '_param' + param + '_val" />').appendTo(ActionParamDIV);
            $('#action' + type + '_param' + param + '_val').val(Lines[id][attr]);
        }

        EventType.chosen({search_contains: true}).change(function () {
            var value = $(this).val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            displayEventVal(value, id);

            Lines[id].event_type = value;
            $('table > tbody > tr.active > td:nth-child(2)').text(Events[value].name.slice(6));
            changeEventsParams(Lines[id]);
        });
        Action1Type.chosen({search_contains: true}).change(function () {
            var value = $(this).val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            displayActionVal(1, value, id);

            Lines[id].action1_type = value;
            $('table > tbody > tr.active > td:nth-child(3)').text(Actions[value].name.slice(7));
            changeActionsParams(1, Lines[id]);
        });
        Action2Type.chosen({search_contains: true}).change(function () {
            var value = $(this).val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            displayActionVal(2, value, id);

            Lines[id].action2_type = value;
            $('table > tbody > tr.active > td:nth-child(4)').text(Actions[value].name.slice(7));
            changeActionsParams(2, Lines[id]);
        });
        Action3Type.chosen({search_contains: true}).change(function () {
            var value = $(this).val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            displayActionVal(3, value, id);

            Lines[id].action3_type = value;
            $('table > tbody > tr.active > td:nth-child(5)').text(Actions[value].name.slice(7));
            changeActionsParams(3, Lines[id]);
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

        Action1Param1DIV.on("change", '#action1_param1_val', function () {
            setActionParamValue(1, 1);
        });
        Action1Param2DIV.on("change", '#action1_param2_val', function () {
            setActionParamValue(1, 2);
        });
        Action1Param3DIV.on("change", '#action1_param3_val', function () {
            setActionParamValue(1, 3);
        });
        Action2Param1DIV.on("change", '#action2_param1_val', function () {
            setActionParamValue(2, 1);
        });
        Action2Param2DIV.on("change", '#action2_param2_val', function () {
            setActionParamValue(2, 2);
        });
        Action2Param3DIV.on("change", '#action2_param3_val', function () {
            setActionParamValue(2, 3);
        });
        Action2Param1DIV.on("change", '#action3_param1_val', function () {
            setActionParamValue(3, 1);
        });
        Action2Param2DIV.on("change", '#action3_param2_val', function () {
            setActionParamValue(3, 2);
        });
        Action2Param3DIV.on("change", '#action3_param3_val', function () {
            setActionParamValue(3, 3);
        });

        function setEventParamValue(param) {
            var attr = 'event_param' + param;
            var value = $('#event_param' + param + '_val').val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            var total = 0;
            switch(EventType.val()) {
                case "8": //EVENT_SPELLHIT
                    if (param == 2) {
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
        function setActionParamValue(type, param) {
            var attr = 'action'+type+'_param' + param;
            var value = $('#action'+type+'_param'+ param+ '_val').val();
            var id = $('table > tbody > tr.active > td:first-child').text();

            var ActionType;
            switch(type)
            {
                case 1: ActionType = Action1Type; break;
                case 2: ActionType = Action2Type; break;
                case 3: ActionType = Action3Type; break;
                default: return;
            }

            var total = 0;
            switch (ActionType.val()) {
                case "11": //ACTION_CAST
                    if (param == 3) {
                        for (i = 0; i < value.length; i++) {
                            total += value[i] << 0;
                        }
                        Lines[id][attr] = total;
                    } else
                        Lines[id][attr] = value;
                    break;
                case "18": //ACTION_SET_UNIT_FLAG
                case "19": //ACTION_REMOVE_UNIT_FLAG
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
        function changeActionsParams(type, Line) {
            switch(type)
            {
                case 1:
                    Action1Param1.html(Actions[Line['action'+type+'_type']].param1);
                    Action1Param2.html(Actions[Line['action'+type+'_type']].param2);
                    Action1Param3.html(Actions[Line['action'+type+'_type']].param3);
                    break;
                case 2:
                    Action2Param1.html(Actions[Line['action'+type+'_type']].param1);
                    Action2Param2.html(Actions[Line['action'+type+'_type']].param2);
                    Action2Param3.html(Actions[Line['action'+type+'_type']].param3);
                    break;
                case 3:
                    Action3Param1.html(Actions[Line['action'+type+'_type']].param1);
                    Action3Param2.html(Actions[Line['action'+type+'_type']].param2);
                    Action3Param3.html(Actions[Line['action'+type+'_type']].param3);
                    break;
                default: return;
            }
            for (i = 0; i < 4; i++) {
                if ($('#action'+type+'_param' + i).text() == "")
                    $('#action'+type+'_param' + i + '_val').hide();
                else
                    $('#action'+type+'_param' + i + '_val').show();
            }
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
                },
                'error': function(){
                    Data = id;
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
                },
                'error': function(){
                    Data = id;
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
                },
                'error': function(){
                    Data = id;
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