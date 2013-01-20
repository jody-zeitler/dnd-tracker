/* D&D Encounter Tracker
 * Copyright (c) 2013 Jody Zeitler
 * Licensed under the MIT license.
 * D&D is a trademark of Wizards of the Coast.
 */

var queue = new Array();
var selected = null;
var queued = null;
var saveName = null;

(new Image).src = "move_icon.png";
(new Image).src = "down_arrow.png";
(new Image).src = "checkbox0.png";
(new Image).src = "checkbox1.png";
(new Image).src = "checkbox2.png";

function drawParty(){
	menuClick( $("#menuParty") );
	var html = "<table><tr><th>I</th><th>Name</th><th>Full HP</th><th>AC</th><th>Fort</th><th>Ref</th><th>Will</th><th></th></tr>";
	for (i = 0; i < queue.length; i++){
		if (queue[i].type == 'party'){
			var classString = "class='list'";
			if (i == selected) classString = "class='list selected' ";
			html += "<tr "+classString+"onclick='highlight("+i+", this); showChar()'><td>"+queue[i].init+"</td><td>"+queue[i].name+"</td><td>"+queue[i].fullhp+"</td><td>"+queue[i].ac+"</td><td>"+queue[i].fort+"</td><td>"+queue[i].ref+"</td><td>"+queue[i].will+"</td><td><button onclick=\"removeChar("+i+", 'party')\">X</button></td></tr>";
		}
	}
	html += "<tr><td colspan='8'>New Character: <input id='newchar' /><button onclick=\"addChar('party')\">Add</button>";
	html += "<button style='margin-left: 50px' onclick='healChars()'>Extended Rest</button></td></tr>";
	html += "</table>";
	$("#queue").html(html);
}

function showChar(){
	if (selected in queue){
		var html = "<a class='menuitem movebutton'><img src='move_icon.png' width='12px' /></a>";
		html += "<span id='name' style='font-weight: bold; margin-left: 55px;'><a onclick=\"renameChar('party')\">"+queue[selected].name+"</a></span>";
		html += "<table>";
		html += "<tr><th>Initiative</th><td><input id='init' size='5' onblur='updateChar("+selected+")' value="+queue[selected].init+" /></td></tr>";
		html += "<tr><th>Full HP</th><td><input id='fullhp' size='5' onblur=\"$('#hp').val($(this).val()); $('#surge').val(Math.floor($(this).val()/4)); updateChar("+selected+")\" value="+queue[selected].fullhp+" /></td></tr>";
		html += "<tr><th>Surge Value</th><td><input id='surge' size='5' onblur='updateChar("+selected+")' value="+queue[selected].surge+" /></td></tr>";
		html += "<tr><th>Current HP</th><td><input id='hp' size='5' onblur='updateChar("+selected+")' value="+queue[selected].hp+" /></td></tr>";
		html += "<tr><th>Temp HP</th><td><input id='temp' size='5' onblur='updateChar("+selected+")' value="+queue[selected].temp+" /></td></tr>";
		html += "<tr><th>AC</th><td><input id='ac' size='5' onblur='updateChar("+selected+")' value="+queue[selected].ac+" /></td></tr>";
		html += "<tr><th>Fortitude</th><td><input id='fort' size='5' onblur='updateChar("+selected+")' value="+queue[selected].fort+" /></td></tr>";
		html += "<tr><th>Reflex</th><td><input id='ref' size='5' onblur='updateChar("+selected+")' value="+queue[selected].ref+" /></td></tr>";
		html += "<tr><th>Willpower</th><td><input id='will' size='5' onblur='updateChar("+selected+")' value="+queue[selected].will+" /></td></tr>";
		html += "</table>";
		$("#stats").html(html);
		setListeners();
	}
}

function updateChar(index){
	if (selected in queue){
		queue[index].init = makeInt( $("#init").val() );
		queue[index].fullhp = makeInt( $("#fullhp").val() );
		queue[index].surge = makeInt( $("#surge").val() );
		queue[index].hp = makeInt( $("#hp").val() );
		queue[index].temp = makeInt( $("#temp").val() );
		queue[index].ac = makeInt( $("#ac").val() );
		queue[index].fort = makeInt( $("#fort").val() );
		queue[index].ref = makeInt( $("#ref").val() );
		queue[index].will = makeInt( $("#will").val() );
		drawParty();
	}
}

function healChars(){
	var perm = confirm("This will heal all characters and remove their temporary hit points.");
	if (perm){
		for (i = 0; i < queue.length; i++){
			if (queue[i].type == 'party'){
				queue[i].hp = queue[i].fullhp;
				queue[i].temp = 0;
			}
		}
		drawParty();
	}
}

function drawMonsters(){
	menuClick( $("#menuMonsters") );
	var html = "<table><tr><th>I</th><th>Bonus</th><th>Name</th><th>#</th><th>Full HP</th><th>AC</th><th>Fort</th><th>Ref</th><th>Will</th><th></th></tr>";
	for (i = 0; i < queue.length; i++){
		if (queue[i].type == 'monster'){
			var classString = "class='list'";
			if (i == selected) classString = "class='list selected' ";
			html += "<tr "+classString+"onclick='highlight("+i+", this); showMonster()'><td>"+queue[i].init+"</td><td>"+queue[i].bonus+"</td><td>"+queue[i].name+"</td><td>"+queue[i].num+"</td><td>"+queue[i].fullhp+"</td><td>"+queue[i].ac+"</td><td>"+queue[i].fort+"</td><td>"+queue[i].ref+"</td><td>"+queue[i].will+"</td><td><button onclick=\"removeChar("+i+", 'monster')\">X</button></td></tr>";
		}
	}
	html += "<tr><td colspan='10'>New Monster: <input id='newmonster' /><button onclick=\"addChar('monster')\">Add</button>";
	html += "<button style='margin-left: 50px' onclick='dumpMonsters()'>Remove Monsters</button></td></tr></table>";
	$("#queue").html(html);
}

function showMonster(){
	if (selected in queue){
		var html = "<a class='menuitem movebutton'><img src='move_icon.png' width='12px' /></a>";
		html += "<span id='name' style='font-weight: bold; margin-left: 55px;'><a onclick=\"renameChar('monster')\">"+queue[selected].name+"</a></span>";
		html += "<table>";
		if (queued == null){
			html += "<tr><th>Quantity</th><td><input id='num' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].num+" /></td></tr>";
		}
		html += "<tr><th>Initiative</th><td><input id='init' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].init+" />";
		if (queued == null){
			html += "  Leave blank to roll";
		}
		html += "</td></tr>";
		if (queued == null){
			html += "<tr><th>Init Bonus</th><td><input id='bonus' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].bonus+" />  Added to initiative roll</td></tr>";
		}
		html += "<tr><th>Full HP</th><td><input id='fullhp' size='5' onblur=\"$('#hp').val($(this).val()); $('#surge').val($(this).val()/4); updateMonster("+selected+")\" value="+queue[selected].fullhp+" /></td></tr>";
		html += "<tr><th>Surge Value</th><td><input id='surge' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].surge+" /></td></tr>";
		html += "<tr><th>Current HP</th><td><input id='hp' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].hp+" /></td></tr>";
		html += "<tr><th>Temp HP</th><td><input id='temp' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].temp+" /></td></tr>";
		html += "<tr><th>AC</th><td><input id='ac' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].ac+" /></td></tr>";
		html += "<tr><th>Fortitude</th><td><input id='fort' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].fort+" /></td></tr>";
		html += "<tr><th>Reflex</th><td><input id='ref' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].ref+" /></td></tr>";
		html += "<tr><th>Willpower</th><td><input id='will' size='5' onblur='updateMonster("+selected+")' value="+queue[selected].will+" /></td></tr>";
		html += "</table>";
		$("#stats").html(html);
		setListeners();
	}
}

function updateMonster(index){
	if (selected in queue){
		if (queued == null){
			queue[index].num = makeInt( $("#num").val() );
			queue[index].bonus = makeInt( $("#bonus").val() );
		}
		queue[index].init = makeInt( $("#init").val() );
		queue[index].fullhp = makeInt( $("#fullhp").val() );
		queue[index].surge = makeInt( $("#surge").val() );
		queue[index].hp = makeInt( $("#hp").val() );
		queue[index].temp = makeInt( $("#temp").val() );
		queue[index].ac = makeInt( $("#ac").val() );
		queue[index].fort = makeInt( $("#fort").val() );
		queue[index].ref = makeInt( $("#ref").val() );
		queue[index].will = makeInt( $("#will").val() );
		drawMonsters();
	}
}

function dumpMonsters(){
	var perm = confirm("Are you sure you want to remove all of the monsters?");
	if (perm){
		for (i = 0; i < queue.length; i++){
			if (queue[i].type == 'monster'){
				queue.splice(i, 1);
				i--;
			}
		}
		drawMonsters();
	}
}

function addChar(group){
	if (group == 'party'){
		queue.push( new Character( $("#newchar").val(), 'party' ) );
		selected = queue.length-1;
		drawParty();
		showChar();
		$("#init").focus();
	}else if (group == 'monster'){
		queue.push( new Character( $("#newmonster").val(), 'monster' ) );
		selected = queue.length-1;
		drawMonsters();
		showMonster();
		$("#init").focus();
		$("#num").focus();
	}
}

function removeChar(index, group){
	var perm = confirm("Are you sure you want to remove "+queue[index].name+"?");
	if (perm){
		queue.splice(index, 1);
		if (group == 'party') drawParty();
		else if (group == 'monster') drawMonsters();
	}
}

function renameChar(group){
	$("#name").html("<input id='newName' value='"+queue[selected].name+"' onblur=\"changeName('"+group+"')\" />");
	setListeners();
	$("#newName").focus();
}

function changeName(group){
	var newName = $("#newName").val();
	if ( newName != "" && newName != undefined ) queue[selected].name = newName;
	if (group == 'party'){
		drawParty();
		showChar();
	} else {
		drawMonsters();
		showMonster();
	}
}

function rollInitiative(){
	var error = "";
	for (i = 0; i < queue.length; i++){
		if (queue[i].type == 'party' && queue[i].init == 0){
			if (error == "") error += queue[i].name;
			else error += ", "+queue[i].name;
		}
		if (queue[i].type == 'monster' && queue[i].init == 0){
			queue[i].init = Math.floor(Math.random()*20) + 1 + queue[i].bonus;
		}
	}
	if (error != ""){
		alert("Initiative not specified for "+error+".");
		return;
	}
	cloneMonsters();
	queue.sort(function(a,b){ 
		if (b.init == a.init) return b.name < a.name;
		else return b.init - a.init;
	});
	queued = 0;
	selected = queued;
	drawQueue();
	$("#main").css({"height":"auto"});
	showStats();
	autoSave();
}

function cloneMonsters(){
	for(i = 0; i < queue.length; i++){
		if (queue[i].num > 1){
			var clones = queue[i].num;
			var basename = queue[i].name;
			queue[i].num = 1;
			queue[i].name = basename+" 1";
			for (j = 2; j <= clones; j++){
				var newchar = jQuery.extend({}, queue[i]);
				newchar.name = basename+" "+j;
				queue.push(newchar);
			}
		}
	}
}
	
function drawQueue(){
	menuClick( $("#menuQueue") );
	var html = "<table><tr><th>I</th><th>Name</th><th>HP</th><th>Hit</th><th>AC</th><th>Fort</th><th>Ref</th><th>Will</th><th>Status</th></tr>";
	if (queued == null){
		html += "<tr><td colspan='9'><button onclick='rollInitiative()'>Roll Initiatives and Begin Encounter</button></td></tr>";
	} else {
		for (i = 0; i < queue.length; i++){
			var classes = new Array();
			classes.push("list");
			if (queue[i].hp <= queue[i].fullhp/2) classes.push("bloodied");
			if (queue[i].hp <= 0) classes.push("dead");
			if (i == selected) classes.push("selected");
			if (i == queued) classes.push("queued");
			var classString = "class='"+classes.join(" ")+"' ";
			var tempString = "";
			if (queue[i].temp > 0) tempString = " class='temporary'";
			html += "<tr "+classString+"onclick='highlight("+i+", this); showStats()'><td>"+queue[i].init+"</td><td>"+queue[i].name+"</td><td><button onclick='changeHealth("+i+",-1,event)'>-</button><span"+tempString+">"+(queue[i].hp+queue[i].temp)+"</span><button onclick='changeHealth("+i+",1,event)'>+</button></td><td><img class='hit' src='checkbox"+queue[i].hit+".png' onclick='setHit(this,"+i+")' /></td><td>"+queue[i].ac+"</td><td>"+queue[i].fort+"</td><td>"+queue[i].ref+"</td><td>"+queue[i].will+"</td><td>"+queue[i].status+"</td></tr>";
		}
		html += "<tr><td colspan='4'><button onclick='endTurn()'>End Turn</button></td><td colspan='5'><button onclick='endEncounter()'>End Encounter</button></td></tr>";
	}
	html += "</table>";
	$("#queue").html(html);
}

function showStats(){
	if (selected in queue){
		var html = "<a class='menuitem movebutton'><img src='move_icon.png' width='12px' /></a>";
		html += "<strong style='margin-left: 65px;'>"+queue[selected].name+"</strong>";
		html += "<table>";
		html += "<tr><th>Initiative</th><td><button onclick='changeOrder("+selected+", -1)'>Up</button>  "+queue[selected].init+"  <button onclick='changeOrder("+selected+", 1)'>Down</button></td></tr>";
		html += "<tr><th>HP</th><td><input id='hp' size='5' onblur='updateStats("+selected+")' value='"+queue[selected].hp+"' />";
		html += "  <strong>Temp</strong>  <input id='temp' size='5' onblur='updateStats("+selected+")' value='"+queue[selected].temp+"' />";
		html += "  <button onclick='addSurge("+selected+")'>Surge: "+queue[selected].surge+"</button></td></tr>";
		html += "<tr><th>Full HP</th><td>"+queue[selected].fullhp+"</td></tr>";
		html += "<tr><th>AC</th><td>"+queue[selected].ac+"</td></tr>";
		html += "<tr><th>Fortitude</th><td>"+queue[selected].fort+"</td></tr>";
		html += "<tr><th>Reflex</th><td>"+queue[selected].ref+"</td></tr>";
		html += "<tr><th>Willpower</th><td>"+queue[selected].will+"</td></tr>";
		html += "<tr><th>Status</th><td id='statusCell'><input id='status' style='width:240px' onblur='updateStats("+selected+")' value='"+queue[selected].status+"' />";
		html += "<a class='menuitem' onclick='showStatuses(event)'><img src='down_arrow.png' width='14px' /></a></td></tr>";
		html += "<tr><th>Notes</th><td><textarea id='notes' style='width:260px;height:125px' onblur='updateStats("+selected+")'>"+queue[selected].notes+"</textarea></td></tr>";
		html += "</table>";
		$("#stats").html(html);
		setListeners();
	}
}

function showStatuses(event){
		event.stopPropagation();
		var statuses = [ "blinded", "dazed", "deafened", "dominated", "dying", "helpless", "immobilized", "marked", "petrified", "prone", "restrained", "slowed", "stunned", "surprised", "unconscious", "weakened" ];
		var html = "<div id='statusDiv' style='position: absolute'><select id='statusSuggest' style='width:244px' size='5' onchange='statusChange()'>";
		for (var i in statuses){
			html += "<option>"+statuses[i]+"</option>"; }
		html += "</select></div>";
		$("#statusCell").append(html);
		$("#statusDiv").click(function(e){ e.stopPropagation(); });
		$(document).click(function(){ $("#statusDiv").remove(); });
}

function statusChange(){
	var newValue = $("#statusSuggest").val();
	var oldValue = $("#status").val();
	if (oldValue != "") newValue = oldValue+", "+newValue;
	$("#status").val(newValue);
	$("#statusDiv").remove();
	$("#status").focus().blur();
}
		
function updateStats(index){
	if (selected in queue){
		queue[index].hp = calculate( $("#hp").val() );
		queue[index].temp = calculate( $("#temp").val() );
		$("#hp").val( queue[index].hp );
		$("#temp").val( queue[index].temp );
		queue[index].status = $("#status").val();
		queue[index].notes = $("#notes").val();
		drawQueue();
	}
}

function changeHealth(index, amount, event){
	if (index in queue){
		event.stopPropagation();
		if (queue[index].temp > 0 && amount == -1) queue[index].temp += amount;
		else if ( amount == -1 || (amount == 1 && queue[index].hp < queue[index].fullhp) )
			queue[index].hp += amount;
		drawQueue();
	}
}

function addSurge(index) {
	if (index in queue){
		queue[index].hp += queue[index].surge;
		if (queue[index].hp > queue[index].fullhp) queue[index].hp = queue[index].fullhp;
		$("#hp").val( queue[index].hp );
		drawQueue();
	}
}

function changeOrder(index, amount){
	var next;
	if (amount == 1){
		if (index+1 in queue){ next = index+1; }
		else { return; }
	} else {
		if (index-1 in queue){ next = index-1; }
		else{ return; }
	}
	var temp = queue[index];
	queue[index] = queue[next];
	queue[next] = temp;
	selected = next;
	drawQueue();
	showStats();
}

function setHit(img, num) {
	queue[num].hit = (queue[num].hit+1) % 3;
	img.src = "checkbox"+queue[num].hit+".png";
}

function highlight(index, row){
	$("input:focus").blur();
	selected = index;
	$(".selected").removeClass("selected");
	$(row).addClass("selected");
}

function endTurn(){
	do {
		queued++;
		if (! (queued in queue) ) queued = 0;
	} while (queue[queued].type == 'monster' && queue[queued].hp <= 0);
	for (var i=0; i < queue.length; i++) queue[i].hit = 0;
	selected = queued;
	drawQueue();
	showStats();
	autoSave();
}

function endEncounter(){
	var perm = confirm("Are you sure you want to end the encounter?");
	if (perm){
		queued = null;
		for (i = 0; i < queue.length; i++){
			queue[i].init = 0;
			queue[i].status = "";
			queue[i].temp = 0;
			queue[i].hit = 0;
		}
		drawQueue();
	}
	autoSave();
}

function drawSaveLoad(){
	menuClick( $("#menuSaveLoad") );
	var html = "<table><tr><td>Save Name:</td><td><input id='saveName' /></td><td><button onclick='save()'>Save</button></td><td id='saveFeed' width='100'></td></tr>";
	html += "<tr><td>Load Name:</td><td><input id='loadName' /></td><td><button onclick='load()'>Load</button></td><td id='loadFeed' width='100'></td></tr>";
	//html += "<tr><td>Autosave Name:</td><td><input id='autoSave' value='"+( (saveName == null) ? "" : saveName )+"' /></td><td><button onclick='setAutoSave()'>&nbsp;Set&nbsp;</button></td><td id='autoSaveFeed' width='100'></td></tr>";
	html += "<tr><td colspan='4'><hr></td></tr>";
	html += "<tr><td colspan='4'><button onclick='clearData()'>Clear Data</button><button onclick='showJSON()'>Save/Load JSON</button></td></tr></table>";
	$("#queue").html(html);
}

function clearData(){
	var perm = confirm("This will reset the characters, monsters, and queue.");
	if (perm){
		queue = new Array();
		queued = null;
	}
}

function setAutoSave(){
	if ( $("#autoSave").val() == "" ) {
		saveName == null;
		$("#autoSaveFeed").html("Autosave Unset");
	} else {
		saveName = $("#autoSave").val();
		$("#autoSaveFeed").html("Autosave Set");
	}
}

function save(){
	var saveNameForm = $("#saveName").val();
	if (saveNameForm == "") return;
	saveName = saveNameForm;
	var saveData = { "saveName" : saveName, "queue" : queue, "queued" : queued };
	$.ajax({
		type: 'POST',
		url: 'save.php',
		data: {"saveName" : saveName, "saveData" : saveData},
		success: function(data){
			if (data == "FILEEXISTS"){
				var perm = confirm("Save name exists. Overwrite?");
				if (perm){
					$.ajax({
						type: 'POST',
						url: 'save.php',
						data: { "saveName" : saveName, "saveData" : saveData, "overwrite" : "yes" },
						success: function(data){
							if (data == "OK") $("#saveFeed").html("Saved");
							else $("#saveFeed").html("File Not Saved");
						}
					});
				} else { $("#saveFeed").html(""); }
			} else { $("#saveFeed").html("Saved"); }
		}
	});
	$("#saveFeed").html("Saving...");
}

function autoSave(){
	var saveData = { "saveName" : saveName, "queue" : queue, "queued" : queued };
	$.cookie("dnd-queue", JSON.stringify(saveData));
	if (saveName != null) {
		$.ajax({
			type: 'POST',
			url: 'save.php',
			data: {"saveName" : saveName, "saveData" : saveData, "overwrite" : "yes"}
		});
	}
}

function load(){
	var loadName = $("#loadName").val();
	if (loadName == "") return;
	$.ajax({
		type: 'POST',
		url: 'load.php',
		data: {loadName : loadName},
		success: function(data){
			if (data == "NODATA") {
				$("#loadFeed").html("File Not Found");
			} else {
				try {
					var json = jQuery.parseJSON(data);
					if ( queue.length == 0 && queued == null && json.queued != "null" ) queued = json.queued;
					for (i=0; i < json.queue.length; i++){
						queue.push( charFromJSON(json.queue[i]) );
					}
					$("#loadFeed").html("Loaded");
				} catch(e) {
					$("#loadFeed").html("Corrupted File");
				}
			}
		}
	});
	$("#loadFeed").html("Loading...");
}

function loadCookie() {
	var data = $.cookie("dnd-queue");
	if (data == null) return false;
	var json = JSON.parse(data);
	saveName = json.saveName;
	if ( queue.length == 0 && queued == null && json.queued != "null" ) queued = json.queued;
	for (i=0; i < json.queue.length; i++) {
		queue.push( charFromJSON(json.queue[i]) );
	}
	return true;
}

function showJSON(){
	var saveData = { "queue" : queue };
	saveData = JSON.stringify(saveData);
	
	var html = "<div class='popup'>";
	html += "<a class='menuitem movebutton'><img src='move_icon.png' width='12px' /></a><br /><hr>";
	html += "<textarea style='width:398px;height:70%'>"+saveData+"</textarea><br /><hr>";
	html += "<div style='text-align:center'><button onclick=\"loadJSON( $(this).parent().siblings('textarea').val() )\">Load</button><button onclick=\"$(this).parent().parent().remove();\">Close</button></div>";
	html += "</div>";
	
	$("body").append(html);
	$(".popup").draggable().draggable("disable");
	setListeners();
}

function loadJSON(string){
	try{
		var json = jQuery.parseJSON(string);
		//saveName = json.saveName;
		for (i=0; i < json.queue.length; i++){
			queue.push( charFromJSON(json.queue[i]) );
		}
		alert("Data loaded.");
	}
	catch(e){
		alert("JSON was malformed. Data was not loaded.");
	}
}

function Character(name, type){
	this.type = type;
	this.name = name;
	this.num = 1;
	this.init = 0;
	this.bonus = 0;
	this.fullhp = 0;
	this.surge = 0;
	this.hp = 0;
	this.temp = 0;
	this.ac = 0;
	this.fort = 0;
	this.ref = 0;
	this.will = 0;
	this.status = "";
	this.notes = "";
	this.hit = 0;
}

function charFromJSON(obj){
	var newChar = new Character(obj.name, obj.type);
	newChar.num = makeInt(obj.num);
	newChar.init = makeInt(obj.init);
	newChar.bonus = makeInt(obj.bonus);
	newChar.fullhp = makeInt(obj.fullhp);
	newChar.surge = makeInt(obj.surge);
	newChar.hp = makeInt(obj.hp);
	newChar.temp = makeInt(obj.temp);
	newChar.ac = makeInt(obj.ac);
	newChar.fort = makeInt(obj.fort);
	newChar.ref = makeInt(obj.ref);
	newChar.will = makeInt(obj.will);
	newChar.status = obj.status;
	newChar.notes = obj.notes;
	return newChar;
}

var total = 0;

function roll(type){
	var value = Math.floor(Math.random()*type) + 1;
	var temp = $("#d"+type).html();
	if (temp == ""){
		$("#d"+type).html(value);
	} else {
		$("#d"+type).html(temp+" + "+value);
	}
	total = total + value;
	$("#total").html(total);
}

function clearRolls(){
	$("#d4").html("");
	$("#d6").html("");
	$("#d8").html("");
	$("#d10").html("");
	$("#d12").html("");
	$("#d20").html("");
	$("#total").html("");
	total = 0;
}

function makeInt(n){
	if ( isNaN(n) || n == ""){
		return 0;
	} else {
		return parseInt(n);
	}
}

function calculate(expr){
	if(	expr.indexOf("+") > -1 ){
		expr = expr.split("+");
		var x = makeInt(expr[0]);
		var y = makeInt(expr[1]);
		return x + y;
	} else if ( expr.indexOf("-") > -1 ){
		expr = expr.split("-");
		var x = makeInt(expr[0]);
		var y = makeInt(expr[1]);
		return x - y;
	}
	return makeInt(expr);
}

function menuClick(item){
	//$("input:focus").blur();
	$(".menuselect").removeClass("menuselect");
	$(item).addClass("menuselect");
}

function setListeners(){
	$(".movebutton").mousedown( function(){
		$("div").draggable("enable"); });

	$(".movebutton").mouseup( function(){
		$("div").draggable("disable"); });

	$("input").keypress(function(e){
		if (e.keyCode == 13) $("input:focus").blur(); });
}

$(document).ready(function(){
	$("div").draggable().draggable("disable");
	if ( loadCookie() ) {
		if (queued == null) drawParty();
		else drawQueue();
	} else drawSaveLoad();
	setListeners();
	$("#main").resizable();
});
