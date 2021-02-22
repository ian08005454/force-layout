import { colorPanelInit } from './colorPanelSetting';
import { keywordFliter } from './mainSetting';
import { keywordItemAppend, keywords } from './keywordCleaner.js';
export function listGenerator(option, route) {
	nodeList(option.series[0].nodes, route);
	lineList(option.series[0].categories, route);
}
function nodeList(dataset, route) {
	$('.current_node').html(`顯示的點 : (${dataset.length})`);
	$('.nodeSelected').children().remove();
	var index = 0;
	for (const name of groupName) {
		const details = document.createElement('details');
		var summary = document.createElement('summary');
		summary.appendChild(document.createTextNode(name));
		var colorLump = document.createElement('button');
		colorLump.className = 'color-lump';
		colorLump.role = 'button';
		colorLump.name = index;
		colorLump.value = colorLump.style.backgroundColor = userColors[index];
		colorLump.id = 'node';
		summary.appendChild(colorLump);
		details.appendChild(summary);
		details.className = `nodeList${index}`;
		$('.nodeSelected').append(details);
		dataset.forEach((item) => {
			if (item.gp === index) {
				var lableName = item.name;
				var disabled = '';
				if (route !== undefined && route.length !== 0) {
					var routeCount = 0;
					route.forEach((element) => {
						if (element.includes(item.name)) routeCount++;
					});
					if (route.length === routeCount) lableName = `${item.name} (必要)`;
				}
				if (keywords.includes(item.name)) disabled = `disabled="disabled"`;
				$(`.nodeList${index}`).append(`<div class="nodeSelected_item" value="${item.name}">
             <label><font color="${item.itemStyle
					.color}"><input type="checkbox" id="${item.name}" name="node_list" value="${item.name}" ${disabled}  checked >${lableName}</front></label>
             <div class="color-lump" style="background-color:${item.itemStyle.color}"></div></div>`);
			}
		});
		index++;
	}

	$('.nodeSelected').scrollTop(function() {
		return this.scrollHeight;
	});
	document.querySelector('.nodeSelected').onchange = function(e) {
		nodeListChange(e);
	};
}
function lineList(dataset, route) {
	let mustLine = [];
	$('.current_relation').html(`顯示的線 : (${dataset.length})`);
	$('.lineSelected').children().remove();
	let list = [];
	if (route !== undefined && route.length !== 0) {
		for (let index = 1; index < route.length; index++) {
			mustLine = mustLine.filter(function(element, index, arr) {
				return arr.indexOf(element) !== index;
			});
		}
	}
	dataset.forEach((item) => {
		if (item.value === 0) {
			if (!list.includes('無共現')) {
				list.push('無共現');
				$('.lineSelected').append(`<div class="lineSelected_item" data-item="無共現">
            <label><font color="gray"><input type="checkbox" name="node_list" value="無共現" checked>無共現(0)</front></label></div><div class="color-lump" style="background-color:"gray"></div>`);
			}
		}
	});
	dataset.forEach((item) => {
		if (!list.includes(item.name)) {
			list.push(item.name);
			var name = item.name;
			if (mustLine.includes(item.name)) {
				name = `${item.name} (必要)`;
			}
			$('.lineSelected').append(`<div class="lineSelected_item" value="${item.name}">
            <label><font color="${item.lineStyle
				.color}"><input type="checkbox" name="lineList" value="${item.name}" checked>${name}</front></label></div><div classs="${item.name}"><button id='line' class="color-lump" role="button"  name="${item.name}" value="${item
				.lineStyle.color}" style="background-color: ${item.lineStyle.color}"></button></div>`);
		}
	});
	$('.lineSelected').scrollTop(function() {
		return this.scrollHeight;
	});
	document.querySelector('.lineSelected').onchange = function(e) {
		lineListChange(e);
	};
	$('button.color-lump').off('click').click((e) => {
		console.log(e.currentTarget.name);
		console.log(e.currentTarget.value);
		console.log(e.currentTarget.id);
		colorPanelInit(e.currentTarget.name, e.currentTarget.value, e.currentTarget.id);
	});
}
function nodeListChange(e) {
	console.log(e.target.value);
	keywordItemAppend(e.target.value, 'not', 'node');
	keywordFliter();
}
function lineListChange(e) {
	console.log(e.target.value);
	keywordItemAppend(e.target.value, 'not', 'line');
	keywordFliter();
}
