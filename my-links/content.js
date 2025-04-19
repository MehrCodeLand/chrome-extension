// Listen for copy events in the page
document.addEventListener('copy', function(event) {
    // We can't directly access clipboard due to permission limitations,
    // so we'll rely on the context menu and manual entry instead.
    // This listener is kept for potential future implementation
    console.log('Copy event detected');
  });
  
  // Function to check if a string is a valid URL
  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }