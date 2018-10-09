module.exports = function (RED) {
    "use strict";

    function Brightness(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var installationObj = RED.nodes.getNode(config.installation);

        this.on("input", function (msg) {
            var payload = msg.payload;
            if (typeof payload === "object") {
                var brightness = payload.brightness;
                var duration = payload.duration;
                if (typeof brightness !== "number") {
                    node.error(`Unknown payload.brightness type: ${typeof brightness}`);
                }
                if (typeof duration !== "number" && typeof duration !== "undefined")) {
                    node.error(`Unknown payload.duration type: ${typeof duration}`);
                }
                installationObj.api().setBrightness(
                    Math.min(100, Math.max(0, Math.trunc(brightness))), duration)
                    .catch(function (err) {
                        node.error(err.message, err);
                    })
            } else if (typeof payload === "number") {
                installationObj.api().setBrightness(
                    Math.min(100, Math.max(0, Math.trunc(payload))))
                    .catch(function (err) {
                        node.error(err.message, err);
                    })
            } else {
                node.error(`Unknown payload type: ${typeof payload}`);
            }
        })
    }

    RED.nodes.registerType("brightness", Brightness);
}
