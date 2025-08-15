import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
	return <div>Admin app placeholder</div>
}

const root = document.getElementById('root')
if (root) {
	createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	)
}
