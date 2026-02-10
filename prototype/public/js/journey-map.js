/**
 * Journey Map Panel Behaviour
 * Handles panel open/close, expand/collapse stations, focus trap, and keyboard navigation.
 */
(function() {
  'use strict';

  // Elements
  var overlay = document.getElementById('journey-map-overlay');
  var panel = document.getElementById('journey-map-panel');
  var backdrop = document.getElementById('journey-map-backdrop');
  var closeButton = document.getElementById('close-journey-map');
  var triggerLink = document.getElementById('open-journey-map');

  // Exit if elements not present
  if (!overlay || !panel || !triggerLink) {
    return;
  }

  // Get all focusable elements within the panel
  function getFocusableElements() {
    return panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  // Open the panel
  function openPanel() {
    overlay.removeAttribute('hidden');
    document.body.classList.add('journey-map-open');

    // Focus the panel
    panel.focus();

    // Scroll current station into view
    scrollCurrentStationIntoView();

    // Announce to screen readers
    panel.setAttribute('aria-hidden', 'false');
  }

  // Close the panel
  function closePanel() {
    overlay.setAttribute('hidden', '');
    document.body.classList.remove('journey-map-open');
    panel.setAttribute('aria-hidden', 'true');

    // Return focus to trigger link
    if (triggerLink) {
      triggerLink.focus();
    }
  }

  // Scroll the current station into view
  function scrollCurrentStationIntoView() {
    var currentStation = panel.querySelector('[data-status="current"]');
    if (currentStation) {
      var content = panel.querySelector('.journey-map-content');
      if (content) {
        // Wait for panel animation
        setTimeout(function() {
          currentStation.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }

  // Focus trap - keep focus within panel
  function trapFocus(event) {
    var focusableElements = getFocusableElements();
    var firstFocusable = focusableElements[0];
    var lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift+Tab
      if (document.activeElement === firstFocusable || document.activeElement === panel) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // Toggle station expand/collapse
  function toggleStation(titleButton) {
    var expanded = titleButton.getAttribute('aria-expanded') === 'true';
    var detailId = titleButton.getAttribute('aria-controls');
    var detail = document.getElementById(detailId);

    if (detail) {
      titleButton.setAttribute('aria-expanded', !expanded);
      detail.hidden = expanded;
    }
  }

  // Event listeners

  // Open panel
  triggerLink.addEventListener('click', function(event) {
    event.preventDefault();
    openPanel();
  });

  // Close panel via close button
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      closePanel();
    });
  }

  // Close panel via backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', function() {
      closePanel();
    });
  }

  // Keyboard handling
  panel.addEventListener('keydown', function(event) {
    // Escape key closes panel
    if (event.key === 'Escape') {
      closePanel();
      return;
    }

    // Tab key - trap focus
    if (event.key === 'Tab') {
      trapFocus(event);
    }
  });

  // Station expand/collapse
  var stationTitles = panel.querySelectorAll('.journey-map-station-title');
  stationTitles.forEach(function(title) {
    title.addEventListener('click', function() {
      toggleStation(title);
    });

    // Enter and Space keys
    title.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleStation(title);
      }
    });
  });

})();
