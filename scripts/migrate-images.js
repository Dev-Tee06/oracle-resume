#!/usr/bin/env node
/**
 * Oracle's Mind — Image Migration Script
 *
 * Uploads existing static assets to Supabase Storage and creates
 * portfolio_project + portfolio_image records in the database.
 *
 * Usage:
 *   1. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in your environment (or .env.migration)
 *   2. Run: node scripts/migrate-images.js
 *
 * Requirements:
 *   npm install dotenv @supabase/supabase-js (already installed)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env.migration if it exists
const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationEnvPath = join(__dirname, '..', '.env.migration')

if (existsSync(migrationEnvPath)) {
  const content = readFileSync(migrationEnvPath, 'utf-8')
  content.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
  })
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing environment variables.')
  console.error('   Create .env.migration with:')
  console.error('   SUPABASE_URL=https://xxx.supabase.co')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ASSETS_DIR = join(__dirname, '..', 'src', 'assets')
const BUCKET = 'portfolio-images'

const PROJECTS_TO_MIGRATE = [
  {
    title: 'Anniversary Designs',
    slug: 'anniversary-designs',
    category: 'Anniversary',
    short_description: 'Elegant and heartfelt anniversary graphic designs celebrating love and milestones.',
    technologies: ['Adobe Photoshop', 'Adobe Illustrator'],
    files: ['anniversary1.jpg', 'anniversary2.jpg', 'anniversary3.jpg', 'anniversary4.jpg', 'anniversary5.jpg'],
  },
  {
    title: 'Birthday Designs',
    slug: 'birthday-designs',
    category: 'Birthday',
    short_description: 'Creative and vibrant birthday celebration graphics that make every occasion memorable.',
    technologies: ['Adobe Photoshop', 'Adobe Illustrator'],
    files: ['birthday1.jpg', 'birthday2.jpg', 'birthday3.jpg', 'birthday4.jpg', 'birthday5.jpg', 'birthday6.jpg', 'birthday7.jpg'],
  },
  {
    title: 'Flyer Designs',
    slug: 'flyer-designs',
    category: 'Flyer',
    short_description: 'Bold and attention-commanding promotional flyers designed to capture your audience.',
    technologies: ['Adobe Photoshop', 'Adobe Illustrator'],
    files: ['flyer1.jpg', 'flyer2.jpg', 'flyer3.jpg', 'flyer4.jpg', 'flyer5.jpg', 'flyer6.jpg', 'flyer7.jpg', 'flyer8.jpg'],
  },
  {
    title: 'Logo & Brand Identity',
    slug: 'logo-brand-identity',
    category: 'Logo',
    short_description: 'Distinctive and versatile logo designs built for brand recognition and lasting impressions.',
    technologies: ['Adobe Illustrator', 'Adobe Photoshop'],
    files: ['logo1.jpg', 'logo2.jpg', 'logo3.jpg', 'logo4.jpg', 'logo5.jpg', 'logo6.jpg'],
  },
]

async function uploadFile(filePath, storagePath) {
  const buffer = readFileSync(filePath)
  const ext = filePath.split('.').pop()?.toLowerCase()
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true })

  if (error) throw new Error(`Upload failed for ${filePath}: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function migrate() {
  console.log('🚀  Starting Oracle\'s Mind image migration...\n')

  for (const proj of PROJECTS_TO_MIGRATE) {
    console.log(`📁  Migrating: ${proj.title}`)

    // Check if project already exists
    const { data: existing } = await supabase
      .from('portfolio_projects')
      .select('id')
      .eq('slug', proj.slug)
      .single()

    let projectId

    if (existing) {
      projectId = existing.id
      console.log(`   ⚠️  Project already exists (id: ${projectId}), skipping project creation.`)
    } else {
      // Create project record (without cover yet)
      const { data: newProject, error: createErr } = await supabase
        .from('portfolio_projects')
        .insert({
          title: proj.title,
          slug: proj.slug,
          category: proj.category,
          short_description: proj.short_description,
          technologies: proj.technologies,
          status: 'published',
          sort_order: PROJECTS_TO_MIGRATE.indexOf(proj),
          is_featured: true,
        })
        .select('id')
        .single()

      if (createErr) {
        console.error(`   ❌  Failed to create project: ${createErr.message}`)
        continue
      }
      projectId = newProject.id
      console.log(`   ✓ Created project (id: ${projectId})`)
    }

    let coverId = null

    // Upload images
    for (let i = 0; i < proj.files.length; i++) {
      const filename = proj.files[i]
      const filePath = join(ASSETS_DIR, filename)

      if (!existsSync(filePath)) {
        console.log(`   ⚠️  File not found: ${filename}, skipping.`)
        continue
      }

      const storagePath = `projects/${projectId}/${Date.now()}-${i}-${filename}`

      try {
        const publicUrl = await uploadFile(filePath, storagePath)

        const { data: imgRecord, error: imgErr } = await supabase
          .from('portfolio_images')
          .insert({
            project_id: projectId,
            storage_path: storagePath,
            public_url: publicUrl,
            alt_text: `${proj.title} — design ${i + 1}`,
            sort_order: i,
          })
          .select('id')
          .single()

        if (imgErr) {
          console.error(`   ❌  Failed to insert image record: ${imgErr.message}`)
          continue
        }

        if (i === 0) coverId = imgRecord.id
        console.log(`   ✓ Uploaded ${filename}`)
      } catch (err) {
        console.error(`   ❌  ${err.message}`)
      }
    }

    // Set cover image
    if (coverId) {
      await supabase
        .from('portfolio_projects')
        .update({ cover_image_id: coverId })
        .eq('id', projectId)
      console.log(`   ✓ Cover set`)
    }

    console.log('')
  }

  console.log('✅  Migration complete!')
  console.log('   Open your portfolio at http://localhost:5173/portfolio to verify.')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
