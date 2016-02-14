var NpcModel = {
    modelInfo: {
        viewerModel: {
            type: 8
        },
        aspect: 1
    },
    ShowModel: function(c, a) {
        if (NpcModel.modelViewer) {
            return
        }
        NpcModel.DestroyModel();
        NpcModel.modelInfo.viewerModel.id = a.displayId;
        NpcModel.modelInfo.viewerModel.humanoid = !!(a.humanoid);
        var e;
        NpcModel.containerDiv = e = $WH.ge(c);
        var b = $WH.ce("div", {
            id: "npc-model-container"
        });
        $WH.ae(e, b);
        var d = {
            type: ZamModelViewer.WOW,
            contentPath: "http://wow.zamimg.com/modelviewer/",
            background: "/img/background.png",
            container: $(b),
            aspect: NpcModel.modelInfo.aspect,
            models: NpcModel.modelInfo.viewerModel
        };
        var f = new ZamModelViewer(d);
        NpcModel.modelViewer = f;
        NpcModel.SetModelAnimation()
    },
    SetModelAnimation: function() {
        if (!NpcModel.modelViewer) {
            return
        }
        if (!NpcModel.modelInfo.animation) {
            return
        }
        var c = NpcModel.modelViewer;
        var a = false;
        try {
            a = c.method("isLoaded")
        } catch (b) {
            NpcModel.DestroyModel();
            return
        }
        if (!a) {
            window.setTimeout(NpcModel.SetModelAnimation, 500);
            return
        }
        c.method("setAnimation", NpcModel.modelInfo.animation);
    },
    DestroyModel: function() {
        if (NpcModel.modelViewer) {
            try {
                NpcModel.modelViewer.destroy()
            } catch (a) {}
            delete NpcModel.modelViewer
        }
        if (NpcModel.containerDiv) {
            NpcModel.containerDiv.parentNode.removeChild(NpcModel.containerDiv);
            delete NpcModel.containerDiv
        }
    }
};