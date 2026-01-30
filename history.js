// Wait for DOM so elements like #history-container exist
document.addEventListener('DOMContentLoaded', () => {
  // Read raw history from storage; supports both array of strings and array of objects
  const raw = JSON.parse(localStorage.getItem("searchHistory") || '[]');
  const container = document.getElementById("history-container");
  const clearBtn = document.getElementById('clear-history');

  // Normalize entries to objects of shape { query: string, time: number }
  const normalized = (Array.isArray(raw) ? raw : []).map(item => {
    if (!item) return null;
    if (typeof item === 'string') return { query: item, time: 0 };
    // handle objects that already include query and optionally time
    return { query: String(item.query || ''), time: Number(item.time) || 0 };
  }).filter(Boolean);

  // Sort by time descending so newest appear first
  normalized.sort((a, b) => b.time - a.time);

  function render(){
    if(!container) return;
    container.innerHTML = '';

    if(normalized.length === 0){
      const p = document.createElement('p');
      p.className = 'muted';
      p.textContent = 'No recent searches.';
      container.appendChild(p);
      return;
    }

    normalized.forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';

      const date = item.time ? new Date(item.time) : null;
      const formatted = date ? date.toLocaleString() : '—';

      div.innerHTML = `
        <strong class="term">${escapeHtml(item.query)}</strong>
        <span class="time">${escapeHtml(formatted)}</span>
      `;

      // clicking an item navigates back to the search results page with the query
      div.addEventListener('click', () => {
        window.location.href = `search.html?search=${encodeURIComponent(item.query)}`;
      });

      container.appendChild(div);
    });
  }

  // wire clear button
  if(clearBtn){
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('searchHistory');
      normalized.length = 0; // clear local array
      render();
    });
  }

  // small helper to escape text for HTML insertion
  function escapeHtml(str){
    return String(str).replace(/[&<>\"']/g, (s)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  // initial render
  render();
});