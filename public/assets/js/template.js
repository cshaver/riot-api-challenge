this["JST"] = this["JST"] || {};

this["JST"]["betting-row"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return "<tr id=\"participantScore"
    + alias1(((helper = (helper = helpers.participantId || (depth0 != null ? depth0.participantId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"participantId","hash":{},"data":data}) : helper)))
    + "\">\n  <td class=\"champion-image\">\n    <img src=\""
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.image : depth0)) != null ? stack1.full : stack1), depth0))
    + "\"/>\n  </td>\n  <td class=\"kills\">\n    0\n  </td>\n  <td class=\"deaths\">\n    0\n  </td>\n  <td class=\"assists\">\n    0\n  </td>\n</tr>";
},"useData":true});

this["JST"]["fresh-socket"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<button id=\"newRoom\">New Room</button>";
},"useData":true});

this["JST"]["game-button"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<button id=\"fetchGame\">Fetch Game</button>";
},"useData":true});

this["JST"]["main"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["JST"]["minimap"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"minimap\">\n  <ul class=\"sprite-list\"></ul>\n</div>\n<div class=\"table\">\n</div>";
},"useData":true});

this["JST"]["play-button"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<button id=\"replay\">Go!</button>\n";
},"useData":true});

this["JST"]["room-socket"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "Users: <textarea disabled id=\"userList\" width=\"100\" height=\"200\"></textarea>\n<div class=\"share\"></div>";
},"useData":true});

this["JST"]["share"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<label for=\"share\">Share:</label><input type=\"text\" name=\"share\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"link","hash":{},"data":data}) : helper)))
    + "\"/>";
},"useData":true});

this["JST"]["sprite"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "<li class=\"sprite\" id=\"participantSprite"
    + alias3(((helper = (helper = helpers.participantId || (depth0 != null ? depth0.participantId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"participantId","hash":{},"data":data}) : helper)))
    + "\" style=\"bottom: "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.position : depth0)) != null ? stack1.y : stack1), depth0))
    + "px; left: "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.position : depth0)) != null ? stack1.x : stack1), depth0))
    + "px;\"><img src=\""
    + alias3(((helper = (helper = helpers.sprite || (depth0 != null ? depth0.sprite : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"sprite","hash":{},"data":data}) : helper)))
    + "\"/></li>";
},"useData":true});

this["JST"]["table"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<table>\n  <tbody>\n    <tr>\n      <td>\n        <table class=\"bets team1\">\n          <thead>\n            <tr>\n              <td>Champ</td>\n              <td>Kills</td>\n              <td>Deaths</td>\n              <td>Assists</td>\n            </tr>\n          </thead>\n          <tbody>\n          </tbody>\n        </table>\n      </td>\n      <td>\n        <table class=\"bets team2\">\n          <thead>\n            <tr>\n              <td>Champ</td>\n              <td>Kills</td>\n              <td>Deaths</td>\n              <td>Assists</td>\n            </tr>\n          </thead>\n          <tbody>\n          </tbody>\n        </table>\n      </td>\n    </tr>\n  </tbody>\n</table>\n";
},"useData":true});