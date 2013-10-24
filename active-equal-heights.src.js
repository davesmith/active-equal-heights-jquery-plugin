
/*-------------------------------------------------------------------- 
 * JQuery Plugin: "EqualHeights" & "EqualWidths"
 * by:	Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
 *
 * Copyright (c) 2007 Filament Group
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * Description: Compares the heights or widths of the top-level children of a provided element 
 		and sets their min-height to the tallest height (or width to widest width). Sets in em units 
 		by default if pxToEm() method is available.
 * Dependencies: jQuery library, pxToEm method	(article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/)							  
 * Usage Example: $(element).equalHeights();
   						      Optional: to set min-height in px, pass a true argument: $(element).equalHeights(true);
 * Version: 2.0, 07.24.2008
 * Changelog:
 *  08.02.2007 initial Version 1.0
 *  07.24.2008 v 2.0 - added support for widths
 *  24.10.2013 Dave Smith added perRow support
--------------------------------------------------------------------*/

$.fn.equalHeights = function(o) {
	
	o = o || {};
	
	var px = o.px || false
		,childrenSelector = o.childrenSelector || '> *'
		,perRow = (o.perRow === undefined) ? true : o.perRow
		;
		
	$(this).each(function(){
		
		var currentTallest
			,$children = $(this).find(childrenSelector)
			,currentPositionTop = -1
			,rows = []
			,rowsLength
			;
		
		if (perRow) {
			
			$children.each(function() {
				var $this = $(this);
				if ($this.position().top > currentPositionTop) {
					currentPositionTop = $this.position().top;
					rows[rows.length] = $();
				}
				rows[rows.length - 1] = rows[rows.length - 1].add($this);
			});
					
		}
		else {
			rows = [$children];
		}
		
		rowsLength = rows.length;
		
		for (i = 0; i < rowsLength; i++) {
			
			currentTallest = 0;
			
			$children = rows[i];
			
			// To be able to call this function on window resize need to reset the heights first
			// for ie6, set height since min-height isn't supported
			if ($.browser.msie && $.browser.version == 6.0) {
				$children.css({'height': 'auto'});
			}
			
			$children.css({'min-height': 0}); 
			
			$children.each(function(){
				var $child = $(this);
				if ($child.height() > currentTallest) {
					currentTallest = $child.height();
				}
			});
			
			// Fix issue in Firefox (affected v19) where it didn't always reflow floats back over to the left
			currentTallest += 1;
			
			if (!px && Number.prototype.pxToEm) {
				currentTallest = currentTallest.pxToEm(); //use ems unless px is specified
			}
			
			// for ie6, set height since min-height isn't supported
			if ($.browser.msie && $.browser.version == 6.0) {
				$children.css({'height': currentTallest});
			}
			
			$children.css({'min-height': currentTallest}); 
			
		}
		
		
	});
	return this;
};

// just in case you need it...
// Modifications done to improve equalHeights are incorporated here but untested
$.fn.equalWidths = function(o) {
	
	o = o || {};

	var px = o.px || false
		,childrenSelector = o.childrenSelector || '> *'
		;
		
	$(this).each(function() {
		
		var currentWidest = 0,
			$children = $(this).find(childrenSelector);
		
		// for ie6, set width since min-width isn't supported
		if ($.browser.msie && $.browser.version == 6.0) {
			$children.css({'width': 'auto'});
		}
		$children.css({'min-width': 0}); 
		
		$children.each(function() {
			var $child = $(this);
			if ($child.width() > currentWidest) {
				currentWidest = $child.width();
			}
		});
		if (!px && Number.prototype.pxToEm) {
			currentWidest = currentWidest.pxToEm(); //use ems unless px is specified
		}
		// for ie6, set width since min-width isn't supported
		if ($.browser.msie && $.browser.version == 6.0) {
			$children.css({'width': currentWidest});
		}
		$children.css({'min-width': currentWidest}); 
		
	});
	return this;
};

$.fn.equalHeightsActive = function(o) {
	
	o = o || {};
	
	var doStuff
		,delay = o.delay || 250
		,childrenSelector = o.childrenSelector || '> *'
		,timeoutID
		,perRow = (o.perRow === undefined) ? true : o.perRow
		,$this = $(this)
		;

	doStuff = function() {
		$this.equalHeights({childrenSelector: childrenSelector, perRow: perRow});
	};
	
	doStuff();
	
	timeoutID = setTimeout(doStuff, delay);
	
	$(window).on('resize', function() {
		clearTimeout(timeoutID);
		timeoutID = setTimeout(doStuff, delay);
	});
	
	return this;
	
};
// The full shebang to get spotlights with equal heights and recalculate on window resize
$(function() {
	$('.layout-list-inn').closest('ul,ol').equalHeightsActive({childrenSelector: '> li > div'}).addClass('layout-list-equalheightsactive');
});