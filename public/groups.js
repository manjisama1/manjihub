// --- Obfuscated admin credentials (simple, not 100% secure) ---
const ADMIN_USER = atob('bWFuamlzYW1hMQ=='); // manjisama1
const ADMIN_PASS = atob('bWFhbmppQHNhbWExNg=='); // maanji@sama16

// --- Group Data ---
const GROUPS_KEY = 'manjihub_groups_v1';

// These functions are now defined in app.js with server support
// Keeping localStorage fallback for backward compatibility
function getGroupsLocal() {
  const data = localStorage.getItem(GROUPS_KEY);
  if (data) {
    try { return JSON.parse(data); } catch { return []; }
  }
  return [];
}

function saveGroupsLocal(groups) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

// --- Utility ---
function escapeHTML(str) {
  return (str || '').replace(/[&<>"']/g, function(tag) {
    const chars = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}; return chars[tag] || tag;
  });
}

// Add this function to convert newlines to <br>
function nl2br(str) {
  return (str || '').replace(/\n/g, '<br>');
}

// --- Render Groups (for index.html) ---
async function renderGroups(containerId) {
  const groups = await getGroups();
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  let openIndex = null;
  groups.forEach((g, i) => {
    const card = document.createElement('div');
    card.className = 'group-card bg-white dark:bg-card rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl relative';
    card.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <img src="${g.image || 'https://static.whatsapp.net/rsrc.php/v3/yz/r/36B424nhiLr.png'}" alt="Group" class="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm">
            <div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-textdark">${escapeHTML(g.name)}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">${escapeHTML(g.category || '')}</p>
            </div>
          </div>
          <button class="chevron-btn text-primary hover:text-green-600 transition text-2xl rotate-0" title="Show Description" data-index="${i}"><i class="fas fa-chevron-down"></i></button>
        </div>
        <div class="desc-slide max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
          <div class="py-2">
            <p class="text-gray-700 dark:text-gray-200 mb-4">${nl2br(escapeHTML(g.description || 'No description'))}</p>
            <a href="${g.link}" target="_blank" class="bg-primary hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition shadow-lg flex items-center justify-center gap-2"><i class="fab fa-whatsapp"></i> Join Group</a>
          </div>
        </div>
        <div class="flex space-x-3 mt-6">
          <button onclick="copyToClipboard('${g.link}')" class="flex-1 bg-gray-100 dark:bg-accent hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-textdark font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
            <i class="far fa-copy"></i> Copy
          </button>
          <a href="${g.link}" target="_blank" class="flex-1 bg-primary hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
            <i class="fab fa-whatsapp"></i> Join
          </a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  // Sliding description logic
  let openDesc = null;
  let openChevron = null;
  container.querySelectorAll('.chevron-btn').forEach((btn, idx) => {
    btn.addEventListener('click', function() {
      const desc = container.querySelectorAll('.desc-slide')[idx];
      if (openDesc && openDesc !== desc) {
        openDesc.style.maxHeight = '0px';
        openChevron.classList.remove('rotate-180');
      }
      if (desc.style.maxHeight && desc.style.maxHeight !== '0px') {
        desc.style.maxHeight = '0px';
        btn.classList.remove('rotate-180');
        openDesc = null;
        openChevron = null;
      } else {
        desc.style.maxHeight = desc.scrollHeight + 32 + 'px';
        btn.classList.add('rotate-180');
        openDesc = desc;
        openChevron = btn;
      }
    });
  });
}

// --- Render Groups for Admin (admin16.html) ---
async function renderAdminGroups(containerId, onEdit, onDelete) {
  const groups = await getGroups();
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  groups.forEach((g, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="py-2 px-2"><img src="${g.image || 'https://static.whatsapp.net/rsrc.php/v3/yz/r/36B424nhiLr.png'}" class="w-10 h-10 rounded-full object-cover border-2 border-primary shadow-sm"></td>
      <td class="py-2 px-2 text-gray-800 dark:text-textdark">${escapeHTML(g.name)}</td>
      <td class="py-2 px-2 text-gray-600 dark:text-gray-400">${escapeHTML(g.category || '')}</td>
      <td class="py-2 px-2 text-gray-600 dark:text-gray-400">${nl2br(escapeHTML(g.description || ''))}</td>
      <td class="py-2 px-2"><a href="${g.link}" target="_blank" class="text-primary underline">Link</a></td>
      <td class="py-2 px-2 flex gap-2">
        <button class="edit-btn bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded" data-index="${i}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" data-index="${i}"><i class="fas fa-trash"></i></button>
      </td>
    `;
    container.appendChild(row);
  });
  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.getAttribute('data-index');
      onEdit(idx);
    });
  });
  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.getAttribute('data-index');
      onDelete(idx);
    });
  });
} 