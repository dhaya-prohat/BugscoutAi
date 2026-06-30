const root = document.getElementById('root');

let activeSection = 'dashboard';
let tasks = [
    { id: '1', category: 'SQL Injection', name: 'Basic SQL Injection', completed: false },
    { id: '2', category: 'XSS', name: 'Reflected XSS', completed: false },
    { id: '3', category: 'XSS', name: 'Stored XSS', completed: true }
];

function render() {
    root.innerHTML = `
        <nav class="bg-black bg-opacity-40 p-4 flex justify-between items-center shadow-lg">
            <div class="text-2xl font-bold flex items-center space-x-2">
                <img src="./svgs/BugScout.jpg" class="h-8 w-8 rounded-full " alt="Dashboard Icon" />
                <span>BugScout AI</span>
            </div>
            <div class="space-x-4 flex item-center">
                 <!-- Dashboard Button -->
                <button onclick="switchSection('dashboard')" class="flex items-center space-x-2 text-white hover:text-blue-400">
                    <img src="./svgs/dashboard.svg" class="h-5 w-5 " alt="Dashboard Icon" />
                    <span>Dashboard</span>
                </button>

                <!-- AI Assistant Button -->
                <button onclick="switchSection('ai_assistance')" class="flex items-center space-x-2 text-white hover:text-blue-400">
                    <img src="./svgs/assistant.svg" class="h-5 w-5" alt="AI Assistant Icon" />
                    <span>AI Assistant</span>
                </button>

                <!-- Report Button -->
                

            </div>
        </nav>
        <main class="p-8">
            ${activeSection === 'dashboard' ? renderDashboard() : ''}
            ${activeSection === 'ai_assistance' ? renderAiAssistance() : ''}
            ${activeSection === 'chat' ? renderChat() : ''}
        </main>
    `;
}

function switchSection(section) {
    activeSection = section;
    render();

    if (section === 'ai_assistance') {
        loadAiAssistantScript();
        loadAiAssistantStyles();
    }
}

function loadAiAssistantScript() {
    const script = document.createElement('script');
    script.src = 'chat.js'; // Make sure this is the correct path to your AI assistant script
    document.body.appendChild(script);
}

function loadAiAssistantStyles() {
   
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'chat.css'; // Make sure this is the correct path to your AI assistant CSS file
    link.id = 'chat-css';
    document.head.appendChild(link);
}

function renderDashboard() {
    const completedTasks = tasks.filter(t => t.completed).length;
    const inProgressTasks = tasks.filter(t => !t.completed).length;

    return `
        <div class="space-y-8">
            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                    <div class="flex items-center space-x-3">
                        <img src=./svgs/completed.svg class="h-8 w-8 text-green-400" />
                        <div>
                            <h3 class="text-lg font-semibold mb-2">Completed Tasks</h3>
                            <p class="text-3xl font-bold text-green-400">${completedTasks}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                    <div class="flex items-center space-x-3">
                        <img src=./svgs/progress.svg class="h-8 w-8 text-green-400" />
                        <div>
                            <h3 class="text-lg font-semibold mb-2">In Progress</h3>
                            <p class="text-3xl font-bold text-blue-400">${inProgressTasks}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                    <div class="flex items-center space-x-3">
                        <img src=./svgs/danger.svg class="h-8 w-8 text-green-400" />
                        <div>
                            <h3 class="text-lg font-semibold mb-2">Total Vulnerabilities</h3>
                            <p class="text-3xl font-bold text-yellow-400">${tasks.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Task List -->
            <div class="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h2 class="text-xl font-bold mb-4">Your Progress</h2>
                <div class="space-y-4">
                    ${tasks.map(task => `
                        <div class="flex items-center justify-between p-4 bg-gray-900 rounded-lg transition hover:bg-gray-700">
                            <div class="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    ${task.completed ? 'checked' : ''}
                                    onchange="toggleTask('${task.id}')"
                                    class="h-5 w-5 rounded border-gray-600 text-blue-500"
                                />
                                <div>
                                    <h3 class="font-semibold">${task.name}</h3>
                                    <p class="text-sm text-gray-400">${task.category}</p>
                                </div>
                            </div>
                            <span class="text-sm px-3 py-1 rounded-full ${task.completed ? 'bg-green-600 text-green-200' : 'bg-blue-600 text-blue-200'
        }">${task.completed ? 'Completed' : 'In Progress'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderAiAssistance() {
    return `
        <div id="chat-container" class="flex h-full">
            <div id="sidebar" class="w-64 bg-gray-800 text-white p-4">
                <div class="new-chat bg-gray-700 p-2 rounded mb-4 cursor-pointer">
                    <span class="sparkles-icon"></span> New Chat
                </div>
            </div>

            <div id="mainbox" class="flex-grow flex flex-col">
                <div id="chat-box" class="flex-grow p-4 overflow-y-auto bg-blue"></div>
                
                <form id="input-form" class="flex p-4  bg-blue">
                    <input type="text" id="user-input" placeholder="Message BugScout AI..." class="flex-grow p-2  rounded text-black"/>
                    <button type="submit" id="send-button" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full"><span class="send-icon"></span></button>
                </form>
            </div>
        </div>
    `;
}


function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    render();
}

render();
