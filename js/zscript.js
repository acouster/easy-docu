
angular.module('ng').directive('autoMenuAffix', function() {
	function convertH15ToTreeNodes(hs) {
		// step 1: split 122121222 into 122,12,1222
		var splits = splitIntoSubranks(hs);
		
		// step 2: recurse on each subrank and make nodes
		var nodes = $.map(splits, function (x, i) {
			var leader = x[0];
			x.splice(0, 1);
			return {
				element: leader,
				children: convertH15ToTreeNodes(x)
			};
		});
		return nodes;
	}
	// divides the grande Napoleon's army 12212123332 into more
	// manageable subranks with 1 leader each: 122,12,123332
	function splitIntoSubranks(hs) {
		if (hs.length == 0)
			return [];
		var splits = [];
		var curSplit = [hs[0]];
		for (var i = 1; i < hs.length; i++) {
			var leaderName = curSplit[0].nodeName.toLowerCase();
			var nodeName = hs[i].nodeName.toLowerCase();
			// no place for 2 commanders of same rank, push the battalion forth!
			if (nodeName == leaderName) {
				splits.push(curSplit);
				curSplit = [hs[i]];
			} else {
				curSplit.push(hs[i]);
			}
		}
		splits.push(curSplit);
		return splits;
	}
	function populateULFromTree(elemUL, treeNodes) {
		$.each(treeNodes, function (i, x) {
			var li = $('<li><a href="#' + x.element.id + '">' + $(x.element).html() + '</a></li>');
			if (x.children && x.children.length > 0)
			{
				var subul = $('<ul class="nav"></ul>');
				li.append(subul);
				populateULFromTree(subul, x.children)
			}
			elemUL.append(li);
		});
	}
	function createNavMenu(element, content) {
		var allH = content.find(':header');
		var treeNodes = convertH15ToTreeNodes(allH);
		
		var elemUL = element.find('ul');
		populateULFromTree(elemUL, treeNodes);
		
		// BS jumpy fixed position plugin
		element.affix();
		
		// BS update side menu active element as you scroll :)
		$(document.body).scrollspy({
		  target: '.bs-sidebar',
		});
	}
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			setTimeout(function () {
				createNavMenu(element, $(attrs.contentDiv));
			}, 500);
		}
	};
});
