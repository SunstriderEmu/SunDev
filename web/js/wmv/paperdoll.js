var g_paperdolls = {};

function Paperdoll(c) {
    this.race = 1;
    this.gender = 0;
    this.charClass = 1;
    this.slotHandedness = {
        15: "main",
        21: "main",
        25: "main",
        28: "main",
        14: "off",
        22: "off",
        23: "off"
    };
    $WH.cO(this, c);
    if (!this.id) {
        return
    }
    if (this.parent) {
        this.container = $WH.ce("div");
        this.container.id = this.id;
        this.container.className = "paperdoll";
        $WH.ae($WH.ge(this.parent), this.container)
    } else {
        this.container = $WH.ge(this.id)
    }
    this.slots = $.extend(true, [], g_character_slots_data);
    if (typeof this.enableHD != "boolean") {
        var a = $WH.localStorage.get("paperdoll-hd");
        if (typeof a == "string") {
            this.enableHD = a == "true"
        } else {
            this.enableHD = true
        }
    }
    for (var b in this.slots) {
        this.slots[b].data = {
            raw: [this.slots[b].id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            slot: this.slots[b].itemSlots[0]
        }
    }
    if (g_paperdolls[this.id] && g_paperdolls[this.id].viewer) {
        g_paperdolls[this.id].viewer.destroy();
        g_paperdolls[this.id].viewer = null
    }
    g_paperdolls[this.id] = this;
    this.initialize()
}
Paperdoll.prototype = {
    initialize: function() {
        var g = $WH.ce("div", {
            className: "paperdoll-left"
        });
        var q = $WH.ce("div", {
            className: "paperdoll-right"
        });
        var r = $WH.ce("div", {
            className: "paperdoll-bottom"
        });
        var y = $WH.ce("div", {
            className: "paperdoll-model"
        });
        var l = $WH.ce("div", {
            className: "paperdoll-model-inner",
            id: "paperdoll-model-" + this.id
        });
        var h = $WH.ce("div", {
            className: "paperdoll-responsive-shell"
        });
        var a = $WH.ce("div", {
            className: "paperdoll-responsive-expander"
        });
        $WH.ae(this.container, g);
        $WH.ae(this.container, q);
        $WH.ae(this.container, r);
        $WH.ae(y, l);
        $WH.ae(this.container, y);
        $WH.ae(h, a);
        $WH.ae(this.container, h);
        var o = this;
        this.controlsRight = $WH.ce("div", {
            className: "paperdoll-controls-right"
        });
        $WH.ae(this.container, this.controlsRight);
        var w = $WH.ce("div", {
            className: "paperdoll-fullscreen",
            innerHTML: " " + LANG.pd_fullscreen
        });
        $WH.aef(w, $WH.ce("i", {
            className: "fa fa-expand"
        }));
        $WH.ae(this.controlsRight, w);
        setTimeout(function() {
            $(w).fadeOut(2000)
        }, 7000);
        var p = $WH.ce("div", {
            className: "paperdoll-quality",
            innerHTML: LANG.model + LANG.colon,
            onmousedown: $WH.rf
        });
        $WH.ae(this.controlsRight, p);
        var i = function(j, k) {
            if (j.enableHD === k) {
                return
            }
            $(this).addClass("active").siblings().removeClass("active");
            j.enableHD = k;
            $WH.localStorage.set("paperdoll-hd", JSON.stringify(k));
            j.render.call(j)
        };
        var e = $WH.ce("a", {
            innerHTML: LANG.pd_hd
        });
        e.onclick = i.bind(e, o, true);
        if (this.enableHD) {
            e.className = "active"
        }
        $WH.ae(p, e);
        $WH.ae(p, $WH.ct(" "));
        var z = $WH.ce("a", {
            innerHTML: LANG.pd_sd
        });
        z.onclick = i.bind(z, o, false);
        if (!this.enableHD) {
            z.className = "active"
        }
        $WH.ae(p, z);
        this.controlsLeft = $WH.ce("div", {
            className: "paperdoll-controls-left"
        });
        $WH.ae(this.container, this.controlsLeft);
        var b = $WH.ce("a");
        b.href = "javascript:;";
        $(b).on("click", o.onClickChooseMount.bind(this));
        b.innerHTML = LANG.pd_mount;
        var f = $WH.ce("div", {
            className: "paperdoll-mount"
        });
        $WH.ae(f, b);
        $WH.ae(this.controlsLeft, f);
        var x = $WH.ce("select");
        $WH.aE(x, "change", function() {
            o.onAnimationChange.call(o)
        });
        var n = $WH.ce("div", {
            className: "paperdoll-animation"
        });
        $WH.ae(n, x);
        $WH.ae(this.controlsRight, n);
        this.slotsById = {};
        var v;
        for (var u = 0; u < this.slots.length; ++u) {
            v = Icon.create("inventoryslot_" + this.slots[u].name, 1, null, "javascript:;");
            $WH.ae((u < 8 ? g : (u < 16 ? q : r)), v);
            this.slotsById[this.slots[u].id] = this.slots[u];
            this.slotsById[this.slots[u].id].icon = v;
            if (typeof this.onCreateSlot == "function") {
                this.onCreateSlot(this.slotsById[this.slots[u].id])
            }
        }
        this.equipList = [];
        if (this.data) {
            for (var t = 0; t < this.data.length; ++t) {
                if (!this.data[t].raw) {
                    continue
                }
                this.setSlot(this.data[t], false)
            }
        }
        if (typeof this.sheathMain != "number") {
            this.sheathMain = -1
        }
        if (typeof this.sheathOff != "number") {
            this.sheathOff = -1
        }
        this.sheathed = $WH.localStorage.get("model-viewer-sheathed") == "true";
        this.sheathedLabel = $WH.ce("label", {
            className: "paperdoll-sheathed",
            innerHTML: LANG.pd_sheathed,
            onmousedown: $WH.rf
        });
        $WH.aef(this.sheathedLabel, $WH.ce("input", {
            type: "checkbox",
            checked: this.sheathed,
            onchange: function() {
                o.sheathed = this.checked;
                $WH.localStorage.set("model-viewer-sheathed", o.sheathed ? "true" : "false");
                o.setCharAppearance()
            }
        }));
        $WH.ae(r, this.sheathedLabel);
        if (this.sheathMain == -1 && this.sheathOff == -1) {
            this.sheathedLabel.style.display = "none"
        }
        if (this.hideSlots && this.hideSlots instanceof Array) {
            for (var s = 0, c; c = this.hideSlots[s]; s++) {
                this.slotsById[c].icon.className += " paperdoll-hidden"
            }
        }
        if (true) {
            if ($WH.Tooltip) {
                $WH.Tooltip.prepare();
                $WH.aE($WH.Tooltip.tooltip, "move", function(C) {
                    if (!($WH.Tooltip.tooltip.visibility == "visible")) {
                        return
                    }
                    if (o.viewer && o.viewer.mode == ZamModelViewer.WEBGL) {
                        return
                    }
                    if (!o.viewer || !o.viewer.renderer || !o.viewer.renderer.object) {
                        return
                    }
                    var B = o.viewer.renderer.object[0];
                    if (!B) {
                        return
                    }
                    try {
                        var A = B.getBoundingClientRect();
                        var m = $WH.Tooltip.tooltip.getBoundingClientRect()
                    } catch (D) {
                        return
                    }
                    var j = true;
                    j &= (m.bottom > A.top && m.top < A.bottom);
                    j &= (m.right > A.left && m.left < A.right);
                    var k = j ? "hidden" : "visible";
                    if (k != B.style.visibility) {
                        B.style.visibility = k
                    }
                });
                $WH.aE($WH.Tooltip.tooltip, "hide", function(j) {
                    if (o.viewer && o.viewer.mode == ZamModelViewer.FLASH && o.viewer.renderer && o.viewer.renderer.object) {
                        o.viewer.renderer.object[0].style.visibility = "visible"
                    }
                })
            }
        }
        this.paperdollModel = y;
        this.paperdollModelInner = l;
        this.paperdollModelQuality = p;
        this.render();
        setTimeout(this.checkModelPosition.bind(this), 1);
        $WH.aE(window, "resize", this.checkModelPosition.bind(this))
    },
    checkModelPosition: function() {
        if (this.paperdollModel.offsetWidth + 94 > this.container.offsetWidth) {
            this.paperdollModel.style.left = Math.floor((this.container.offsetWidth - this.paperdollModel.offsetWidth) / 2) + "px";
            this.modelPositionModified = true
        } else {
            if (this.modelPositionModified) {
                this.paperdollModel.style.left = ""
            }
        }
    },
    setSlot: function(D, f) {
        if (D && D.raw && D.raw.length > 0) {
            var o = D.raw;
            var m = o[0];
            if (m && this.slotsById[m]) {
                var b = o[1];
                var y = o[9];
                var x = o[10];
                var s = o.slice(11, 17);
                var k = this.slotsById[m].data.raw && this.slotsById[m].data.raw.length > 1 ? this.slotsById[m].data.raw[1] : 0;
                this.slotsById[m].data.raw = o;
                var A = this.slotsById[m].icon;
                var w = this.slotsById[m].invSlot ? this.slotsById[m].invSlot : null;
                var r = -1;
                if (f && w) {
                    for (var u = 0; u < this.equipList.length; u += 2) {
                        if (this.equipList[u] == w) {
                            r = u;
                            break
                        }
                    }
                }
                if (b && g_items[b]) {
                    var c = g_items[b].quality == 6 ? D.artifactAppearanceMod : null;
                    Icon.setTexture(A, 1, g_items.getIcon(b, s, c).toLowerCase());
                    var C = Icon.getLink(A);
                    var g = [];
                    for (var t in s) {
                        if (s[t]) {
                            g.push(s[t])
                        }
                    }
                    C.href = "/item=" + b + (g.length ? ("&bonus=" + g.join(":")) : "");
                    C.rel = this.getItemRel(o);
                    C.target = "_blank";
                    var z = g_items[b].jsonequip;
                    if (y && g_items[y]) {
                        z = g_items[y].jsonequip
                    }
                    var q = (m == 16 || m == 17) && $WH.in_array([14, 15], z.slotbak) == -1 ? this.slots[m].itemSlots[0] : z.slotbak;
                    var B = ModelViewer.slotMap[q];
                    if (this.slotHandedness[B] && this.slotHandedness[this.slotsById[m].translatedSlot] && this.slotHandedness[B] != this.slotHandedness[this.slotsById[m].translatedSlot]) {
                        this.updateViewer(this.slotsById[m].translatedSlot || ($WH.in_array([14, 15], this.slotsById[m].slotbak) != -1 ? this.slots[m].itemSlots[0] : w))
                    }
                    var p = z.displayid;
                    var n = g_items.getAppearance(y ? y : b, y ? [] : s, c);
                    if (n != null && n[0]) {
                        p = n[0]
                    }
                    if (p && !this.slotsById[m].noModel && !x && b != 5976 && b != 69209 && b != 69210) {
                        if (f) {
                            this.updateViewer(q, p)
                        }
                        if (r == -1) {
                            this.equipList.push(q);
                            this.equipList.push(p)
                        } else {
                            this.equipList.splice(r, 2, q, p)
                        }
                    }
                    this.slotsById[m].invSlot = q;
                    this.slotsById[m].slotbak = z.slotbak;
                    this.slotsById[m].translatedSlot = B
                } else {
                    if (f && w) {
                        Icon.setTexture(A, 1, "inventoryslot_" + this.slotsById[m].name);
                        var C = Icon.getLink(A);
                        C.href = "javascript:;";
                        C.rel = "";
                        this.updateViewer(this.slotsById[m].translatedSlot || ($WH.in_array([14, 15], this.slotsById[m].slotbak) != -1 ? this.slots[m].itemSlots[0] : w));
                        if (r != -1) {
                            this.equipList.splice(r, 2)
                        }
                    }
                }
                var h = [k, b];
                for (var v = 0; v < 2; ++v) {
                    var e = h[v];
                    if (e && g_items[e] && g_items[e].jsonequip.itemset) {
                        for (var u in this.slotsById) {
                            if (this.slotsById[u].data.raw && this.slotsById[u].data.raw.length > 1) {
                                Icon.getLink(this.slotsById[u].icon).rel = this.getItemRel(this.slotsById[u].data.raw)
                            }
                        }
                    }
                }
                if (typeof this.onCreateSlot == "function") {
                    this.onCreateSlot(this.slotsById[m])
                }
            }
        }
    },
    setCharAppearance: function(a) {
        a = this.saveData(a || {});
        this.viewer.method("setAppearance", [a.hairstyle, a.haircolor, a.facetype, a.skincolor, a.features, a.haircolor, a.hornstyle, a.blindfolds, a.tattoos, this.sheathed ? a.sheathMain : -1, this.sheathed ? a.sheathOff : -1])
    },
    saveData: function(a) {
        if (typeof this.lastAppearanceData == "object") {
            a = $.extend(true, {}, this.lastAppearanceData, a)
        }
        if (typeof a.sheathMain != "number") {
            a.sheathMain = -1
        }
        if (typeof a.sheathOff != "number") {
            a.sheathOff = -1
        }
        this.lastAppearanceData = a;
        return a
    },
    updateCharAppearance: function(a) {
        if (this.viewer != null) {
            this.setCharAppearance(a)
        }
    },
    updateSlots: function(b) {
        if (this.viewer != null) {
            for (var a in b) {
                this.setSlot(b[a], true)
            }
        }
    },
    updateViewer: function(a, b) {
        var c = a;
        if (c == 20) {
            c = 5
        }
        this.viewer.method("clearSlots", c.toString());
        if (b) {
            this.viewer.method("attachList", a.toString() + "," + b)
        }
    },
    render: function() {
        var g = $(this.paperdollModelInner);
        if (this.viewer) {
            this.viewer.destroy()
        }
        var e = [];
        var a = [].concat.apply([], this.equipList);
        for (var b = 0; b < a.length; b += 2) {
            e.push([a[b], a[b + 1]])
        }
        var c = this.saveData({
            hairstyle: this.hairstyle,
            haircolor: this.haircolor,
            facetype: this.facetype,
            skincolor: this.skincolor,
            features: this.features,
            hornstyle: this.hornstyle,
            blindfolds: this.blindfolds,
            tattoos: this.tattoos,
            sheathMain: this.sheathMain,
            sheathOff: this.sheathOff
        });
        var f = {
            type: ZamModelViewer.WOW,
            contentPath: ModelViewer.getContentPath(),
            container: g,
            aspect: 0.76,
            background: "background.png",
            sheathMain: this.sheathed ? c.sheathMain : -1,
            sheathOff: this.sheathed ? c.sheathOff : -1,
            hd: this.enableHD,
            sk: this.skincolor,
            ha: this.hairstyle,
            hc: this.haircolor,
            fa: this.facetype,
            fh: this.features,
            fc: this.haircolor,
            ep: this.blindfolds,
            ho: this.hornstyle,
            ta: this.tattoos,
            cls: this.charClass,
            items: e,
            mount: {
                type: ZamModelViewer.Wow.Types.NPC,
                id: this.npcModel
            },
            models: {
                type: ZamModelViewer.Wow.Types.CHARACTER,
                id: g_file_races[this.race] + g_file_genders[this.gender]
            }
        };
        if (this.race == 10 || (this.race == 1 && this.gender == 0)) {
            f.hd = true
        }
        this.viewer = new ZamModelViewer(f);
        this.loadAnimations()
    },
    onSelectMount: function(a) {
        Lightbox.hide();
        this.npcModel = a.npcmodel ? a.npcmodel : 0;
        if (typeof this.onChangeMount == "function") {
            this.onChangeMount(this.npcModel)
        }
        this.render()
    },
    onChooseMountPicker: function(c, g, e) {
        Lightbox.setSize(800, 564);
        if (g) {
            c.className += " paperdoll-picker";
            var f = $WH.ce("div");
            f.className = "lightbox-content listview";
            $WH.ae(c, f);
            var b = $WH.ce("a");
            b.className = "dialog-x fa fa-times";
            b.href = "javascript:;";
            b.onclick = Lightbox.hide;
            $WH.ae(b, $WH.ct(LANG.close));
            $WH.ae(c, b);
            this.mountLv = new Listview({
                template: "mountsgallery",
                id: "mountsgallery",
                data: [],
                selectData: this.onSelectMount.bind(this),
                hideCount: 1,
                parent: f,
                hideBands: 2,
                hideNav: 1 | 2,
                hideHeader: 1,
                searchable: 1,
                poundable: 0,
                filtrable: 0,
                forceBandTop: 1,
                clip: {
                    w: 780,
                    h: 486
                }
            });
            if ($WH.Browser.firefox) {
                $WH.aE(this.mountLv.getClipDiv(), "DOMMouseScroll", g_pickerWheel)
            } else {
                this.mountLv.getClipDiv().onmousewheel = g_pickerWheel
            }
        }
        setTimeout(function() {
            g_safeFocus($("input:visible", c))
        }, 10);
        if (!$WH.isset("g_mounts")) {
            this.loadMountData()
        }
    },
    loadMountData: function() {
        var a = this;
        $.getScript("/data=mount", function() {
            if (!$WH.isset("g_mounts")) {
                return
            }
            var c = [{
                none: 1
            }];
            var b = $.map(g_mounts, function(e) {
                return [e]
            });
            a.mountLv.setData(c.concat(b));
            a.mountLv.refreshRows(true)
        })
    },
    onClickChooseMount: function() {
        Lightbox.show("mountpicker", {
            onShow: this.onChooseMountPicker.bind(this)
        })
    },
    resetPosition: function() {
        this.viewer.renderer.azimuth = Math.PI * 1.5;
        this.viewer.renderer.zenith = Math.PI / 2;
        this.viewer.renderer.translation = [0, 0, 0];
        var b = this.viewer.renderer.models[0];
        var a = b.boundsSize[2];
        var i = b.boundsSize[1];
        var f = b.boundsSize[0];
        var e = this.viewer.renderer.width / this.viewer.renderer.height;
        var c = 2 * Math.tan(this.viewer.renderer.fov / 2 * 0.0174532925);
        var h = c * e;
        var j = (a * 1.2) / c;
        var g = (i * 1.2) / h;
        this.viewer.renderer.distance = Math.max(Math.max(j, g), f * 2);
        this.viewer.method("setAnimation", "StandCharacterCreate")
    },
    getItemRel: function(n) {
        if (!g_items[n[1]]) {
            return
        }
        var k = $WH.g_applyStatModifications(g_items[n[1]].jsonequip, n[2], n[8], 0, n.slice(11, 17));
        var f = n[4 + (k.nsockets | 0)] ? 1 : 0,
            m = [],
            c = [],
            l = [];
        if (n[2]) {
            m.push("rand=" + n[2])
        }
        if (n[8]) {
            m.push("upgd=" + n[8])
        }
        if (n[3]) {
            m.push("ench=" + n[3])
        }
        for (var g = 0, h = (k.nsockets | 0) + f; g < h; ++g) {
            c.push(n[4 + g] > 0 ? n[4 + g] : 0)
        }
        if (c.length) {
            m.push("gems=" + c.join(":"))
        }
        var b = n.slice(11, 17);
        var e = [];
        for (var g = 0; g < b.length; ++g) {
            if (b[g]) {
                e.push(b[g])
            }
        }
        if (e.length > 0) {
            e.sort();
            m.push("bonus=" + e.join(":"))
        }
        if (f) {
            m.push("sock")
        }
        if (g_items[n[1]].jsonequip.itemset) {
            for (var g in this.slotsById) {
                var a = this.slotsById[g].data.raw ? this.slotsById[g].data.raw[1] : 0;
                if (a && g_items[a] && g_items[a].jsonequip.itemset) {
                    l.push(a)
                }
            }
            m.push("pcs=" + l.join(":"))
        }
        if (this.level < 90) {
            m.push("lvl=" + this.level)
        }
        var j = m.join("&");
        if (j) {
            j = "&" + j
        }
        return j
    },
    onAnimationChange: function() {
        var a = $(".paperdoll-animation select", this.container);
        if (this.viewer && this.viewer.method("isLoaded") && a.val()) {
            this.viewer.method("setAnimation", a.val())
        }
    },
    loadAnimations: function() {
        var e = this;
        var k = window.setTimeout(function() {
            e.loadAnimations.call(e)
        }, 500);
        if (!e.hasOwnProperty("animsLoaded")) {
            e.animsLoaded = false
        }
        if (e.animsLoaded) {
            return
        }
        if (!this.viewer || !this.viewer.method("isLoaded")) {
            return
        }
        window.clearTimeout(k);
        var f = $(".paperdoll-animation select", e.container);
        f.empty();
        f.parent().show();
        var b = {};
        var h = this.viewer.method("getNumAnimations");
        for (var g = 0; g < h; ++g) {
            var c = this.viewer.method("getAnimation", g);
            if (c && c != "EmoteUseStanding") {
                b[c] = 1
            }
        }
        var j = [];
        for (var c in b) {
            j.push(c)
        }
        j.sort();
        f.append($("<option/>", {
            text: LANG.animation,
            disabled: true,
            selected: true
        }));
        for (var g = 0; g < j.length; ++g) {
            f.append($("<option/>", {
                text: j[g],
                val: j[g]
            }))
        }
        $(".paperdoll-mount", e.container).show();
        e.animsLoaded = true
    }
};
Listview.templates.mountsgallery = {
    sort: [1],
    mode: 3,
    nItemsPerPage: -1,
    nItemsPerRow: 3,
    poundable: 0,
    columns: [{
        value: "name",
        sortFunc: function(e, c) {
            return Listview.templates.genericmodel.sortFunc(e, c)
        }
    }],
    compute: function(h, j, f) {
        var e = this;
        $WH.aE(j, "click", function() {
            e.selectData(h)
        });
        if (h.none) {
            j.className += "none";
            $WH.ae(j, $WH.ct(LANG.none));
            return
        }
        j.className = "screenshot-cell";
        j.vAlign = "bottom";
        if (h.npcmodel) {
            var b = $WH.ce("a");
            b.href = "javascript:;";
            b.rel = "spell=" + h.id;
            var c = $WH.ce("img");
            c.src = g_staticUrl + ModelViewer.getStaticBase() + "/thumbs/npc/" + h.npcmodel + ".png";
            $WH.ae(b, c);
            $WH.ae(j, b)
        }
        d = $WH.ce("div");
        d.style.position = "relative";
        d.style.height = "1em";
        var g = $WH.ce("div");
        g.className = "screenshot-caption";
        var b = $WH.ce("a");
        b.className = "q";
        b.href = g_getRelativeHostPrefix() + "/spell=" + h.id;
        $WH.ae(b, $WH.ct(h.name));
        $WH.ae(g, b);
        $WH.ae(d, g);
        $WH.ae(j, d)
    },
    sortFunc: function(e, c, f) {
        return ($WH.strcmp(e.displayid, c.displayid) || $WH.strcmp(e.name, c.name))
    }
};