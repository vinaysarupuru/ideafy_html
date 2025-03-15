// Sample idea data (in a real app, this would come from a database or localStorage)
let ideas = [
    {
        id: 1,
        category: 'Business',
        title: 'Subscription-based Plant Delivery',
        description: 'A service that delivers indoor plants monthly with care instructions and seasonal varieties. Would include maintenance tips and replacement guarantee if plants die within the first month.',
        color: 'idea-green'
    },
    {
        id: 2,
        category: 'Technology',
        title: 'AR Learning App',
        description: 'An augmented reality app that lets students visualize complex concepts from their textbooks by scanning pages.',
        color: 'idea-blue'
    },
    {
        id: 3,
        category: 'Health',
        title: 'Meditation Timer with Nature Sounds',
        description: 'A simple meditation timer with customizable ambient nature sounds. Includes guided breathing exercises and tracks meditation streaks.',
        color: 'idea-purple'
    },
    {
        id: 4,
        category: 'Education',
        title: 'Flashcard Collaboration Tool',
        description: 'A platform where students can create and share flashcards for specific courses. Includes spaced repetition learning algorithm and pronunciation guides for language learning.',
        color: 'idea-yellow'
    },
    {
        id: 5,
        category: 'Environment',
        title: 'Community Cleanup Tracker',
        description: 'An app that lets neighborhoods organize cleanup events, track trash collected, and gamify the process with team competitions and rewards from local businesses.',
        color: 'idea-pink'
    },
    {
        id: 6,
        category: 'Finance',
        title: 'Visual Budget Planner',
        description: 'A financial planning app that uses visual metaphors to represent saving goals and spending habits, making budgeting more intuitive and engaging.',
        color: 'idea-red'
    }
];

// Try to load ideas from localStorage if available
function loadIdeas() {
    const storedIdeas = localStorage.getItem('ideafy-ideas');
    if (storedIdeas) {
        try {
            ideas = JSON.parse(storedIdeas);
        } catch (e) {
            console.error('Failed to parse stored ideas:', e);
        }
    }
}

// Save ideas to localStorage
function saveIdeas() {
    localStorage.setItem('ideafy-ideas', JSON.stringify(ideas));
}

// Function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Function to render idea cards
function renderIdeas() {
    const ideasContainer = document.getElementById('ideas-container');
    
    // Clear container
    ideasContainer.innerHTML = '';
    
    // Show empty state if there are no ideas
    if (ideas.length === 0) {
        const emptyStateTemplate = document.getElementById('empty-state');
        const emptyState = document.importNode(emptyStateTemplate.content, true);
        ideasContainer.appendChild(emptyState);
        
        // Add event listener to the empty state new idea button
        const emptyStateBtn = document.getElementById('empty-state-new-idea-btn');
        if (emptyStateBtn) {
            emptyStateBtn.addEventListener('click', () => openModal());
        }
        return;
    }
    
    // Render each idea as a card
    ideas.forEach(idea => {
        const card = document.createElement('div');
        card.className = `bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-${idea.color} hover:shadow-lg transition-shadow duration-300`;
        card.dataset.id = idea.id;
        
        // Card content
        card.innerHTML = `
            <div class="p-5">
                <span class="inline-block px-2 py-1 leading-none bg-${idea.color}/20 text-${idea.color} rounded-full font-semibold uppercase tracking-wide text-xs">${idea.category}</span>
                <h3 class="mt-2 text-xl font-bold">${idea.title}</h3>
                <p class="mt-3 text-gray-600">${truncateText(idea.description, 100)}</p>
            </div>
            <div class="px-5 py-3 bg-gray-50 flex justify-end">
                <button class="text-gray-500 hover:text-gray-700 mr-4 edit-idea" data-id="${idea.id}" aria-label="Edit idea">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                <button class="text-gray-500 hover:text-gray-700 delete-idea" data-id="${idea.id}" aria-label="Delete idea">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
        
        // Add the card to the container
        ideasContainer.appendChild(card);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-idea').forEach(button => {
        button.addEventListener('click', editIdea);
    });

    document.querySelectorAll('.delete-idea').forEach(button => {
        button.addEventListener('click', deleteIdea);
    });
}

// Function to open the modal
function openModal(isEditing = false, ideaId = null) {
    const modal = document.getElementById('new-idea-modal');
    const modalTitle = modal.querySelector('h3');
    const form = document.getElementById('new-idea-form');
    
    // Clear the form
    form.reset();
    
    // Set the title based on whether we're editing or creating
    modalTitle.textContent = isEditing ? 'Edit Idea' : 'Create New Idea';
    
    // If editing, populate the form with the idea's data
    if (isEditing && ideaId) {
        const idea = ideas.find(idea => idea.id === parseInt(ideaId));
        if (idea) {
            document.getElementById('category').value = idea.category;
            document.getElementById('title').value = idea.title;
            document.getElementById('description').value = idea.description;
            
            // Find the color radio button and check it
            const colorId = idea.color.replace('idea-', '');
            const colorRadio = document.getElementById(`color-${colorId}`);
            if (colorRadio) {
                colorRadio.checked = true;
            }
            
            // Store the idea ID in the form for reference when saving
            form.dataset.ideaId = idea.id;
        }
    } else {
        // Clear any previously stored idea ID
        delete form.dataset.ideaId;
    }
    
    // Show the modal
    modal.classList.remove('hidden');
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('new-idea-modal');
    modal.classList.add('hidden');
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const isEditing = form.dataset.ideaId !== undefined;
    
    // Get form values
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const color = document.querySelector('input[name="color"]:checked').value;
    
    if (isEditing) {
        // Update existing idea
        const ideaId = parseInt(form.dataset.ideaId);
        const ideaIndex = ideas.findIndex(idea => idea.id === ideaId);
        
        if (ideaIndex !== -1) {
            ideas[ideaIndex].category = category;
            ideas[ideaIndex].title = title;
            ideas[ideaIndex].description = description;
            ideas[ideaIndex].color = color;
        }
    } else {
        // Create new idea
        const newIdea = {
            id: ideas.length > 0 ? Math.max(...ideas.map(idea => idea.id)) + 1 : 1,
            category,
            title,
            description,
            color
        };
        
        ideas.push(newIdea);
    }
    
    // Save ideas to localStorage
    saveIdeas();
    
    // Close the modal and refresh the idea list
    closeModal();
    renderIdeas();
}

// Function to handle editing an idea
// Function to handle editing an idea
function editIdea(event) {
    const ideaId = event.currentTarget.dataset.id;
    openModal(true, ideaId);
}

// Function to handle deleting an idea
function deleteIdea(event) {
    const ideaId = parseInt(event.currentTarget.dataset.id);
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this idea?')) {
        const ideaIndex = ideas.findIndex(idea => idea.id === ideaId);
        
        if (ideaIndex !== -1) {
            ideas.splice(ideaIndex, 1);
            saveIdeas(); // Save changes to localStorage
            renderIdeas();
        }
    }
}

// Function to handle search/filtering
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // If search term is empty, show all ideas
        if (!searchTerm.trim()) {
            renderIdeas();
            return;
        }
        
        // Filter ideas based on search term
        const filteredIdeas = ideas.filter(idea => 
            idea.title.toLowerCase().includes(searchTerm) ||
            idea.category.toLowerCase().includes(searchTerm) ||
            idea.description.toLowerCase().includes(searchTerm)
        );
        
        renderFilteredIdeas(filteredIdeas);
    });
}

// Function to render filtered ideas
function renderFilteredIdeas(filteredIdeas) {
    const ideasContainer = document.getElementById('ideas-container');
    
    // Clear container
    ideasContainer.innerHTML = '';
    
    // Show message if no results found
    if (filteredIdeas.length === 0) {
        ideasContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">No ideas match your search.</p>
            </div>
        `;
        return;
    }
    
    // Render filtered ideas
    filteredIdeas.forEach(idea => {
        const card = document.createElement('div');
        card.className = `bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-${idea.color} hover:shadow-lg transition-shadow duration-300`;
        card.dataset.id = idea.id;
        
        card.innerHTML = `
            <div class="p-5">
                <span class="inline-block px-2 py-1 leading-none bg-${idea.color}/20 text-${idea.color} rounded-full font-semibold uppercase tracking-wide text-xs">${idea.category}</span>
                <h3 class="mt-2 text-xl font-bold">${idea.title}</h3>
                <p class="mt-3 text-gray-600">${truncateText(idea.description, 100)}</p>
            </div>
            <div class="px-5 py-3 bg-gray-50 flex justify-end">
                <button class="text-gray-500 hover:text-gray-700 mr-4 edit-idea" data-id="${idea.id}" aria-label="Edit idea">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                <button class="text-gray-500 hover:text-gray-700 delete-idea" data-id="${idea.id}" aria-label="Delete idea">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
        
        ideasContainer.appendChild(card);
    });

    // Re-attach event listeners
    document.querySelectorAll('.edit-idea').forEach(button => {
        button.addEventListener('click', editIdea);
    });

    document.querySelectorAll('.delete-idea').forEach(button => {
        button.addEventListener('click', deleteIdea);
    });
}

// Set up event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load ideas from localStorage
    loadIdeas();
    
    // Initial render
    renderIdeas();
    
    // New idea button in header
    const newIdeaBtn = document.querySelector('header button');
    if (newIdeaBtn) {
        newIdeaBtn.addEventListener('click', () => openModal());
    }
    
    // Cancel button in modal
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Modal background click to close
    const modal = document.getElementById('new-idea-modal');
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Form submission
    const form = document.getElementById('new-idea-form');
    form.addEventListener('submit', handleFormSubmit);
    
    // Setup search functionality
    setupSearch();
});