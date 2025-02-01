import { init, id } from '@instantdb/admin';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize InstantDB with admin credentials
const db = init({ 
    appId: '64f0fba2-3b2d-4090-a6b4-d492bb2bb7cc',
    adminToken: '31d58884-4afd-45f0-a183-59a50869e6f1'
});

async function migrateData() {
    try {
        // Read the portfolio.json file
        const portfolioPath = path.join(__dirname, '..', 'data', 'portfolio.json');
        const portfolioData = JSON.parse(
            await fs.readFile(portfolioPath, 'utf8')
        );

        console.log('Portfolio data loaded successfully');
        console.log(`Found ${portfolioData.projects.length} projects to migrate`);

        // Process each project one at a time
        for (const project of portfolioData.projects) {
            console.log(`Processing project: ${project.title}`);
            try {
                // Convert all fields from the project
                const projectData = {
                    // Basic Info
                    title: project.title,
                    company: project.company,
                    description: project.description,
                    location: project.location,
                    
                    // Visual Elements
                    logo: project.logo,
                    backgroundColor: project.backgroundColor,
                    
                    // Case Study
                    caseStudyFile: project.caseStudyFile,
                    
                    // Media
                    images: project.images || [],
                    
                    // Additional Fields
                    tags: project.tags || [],
                    
                    // Position for sorting (higher number = higher priority)
                    position: project.id
                };

                // Remove any undefined or null values
                Object.keys(projectData).forEach(key => {
                    if (projectData[key] === undefined || projectData[key] === null) {
                        delete projectData[key];
                    }
                });

                // Use InstantDB's id() function for the ID
                const projectId = id();
                await db.transact(
                    db.tx.portfolio_items[projectId].update(projectData)
                );
                console.log(`Successfully migrated: ${project.title}`);
            } catch (error) {
                console.error(`Failed to migrate project ${project.title}:`, error);
            }
        }

        console.log('Migration completed!');
        
        // Verify the migration and show sample data
        const data = await db.query({ portfolio_items: {} });
        if (data?.portfolio_items) {
            const items = Object.values(data.portfolio_items);
            console.log(`\nVerified: ${items.length} projects in InstantDB`);
            
            // Display a few sample projects
            console.log('\nSample Projects:');
            items.slice(0, 3).forEach((project, index) => {
                console.log(`\nProject ${index + 1}: ${project.title}`);
                console.log(JSON.stringify(project, null, 2));
            });
        }

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
migrateData();
