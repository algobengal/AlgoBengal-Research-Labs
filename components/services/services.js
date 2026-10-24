fetch('components/services/services.html')
  .then(response => { if (!response.ok) throw new Error('Services component unavailable'); return response.text(); })
  .then(markup => { const node = document.getElementById('services-component'); if(node) node.innerHTML = markup; })
  .catch(error => console.error('Error loading services component:', error));
