# Multi-Agent Development Workflow

This document describes the automated multi-agent pipeline for implementing screens in the Possessions prototype.

---

## Overview

We use three specialized AI agents working in sequence to implement screens from rough requirements to production code:

```
Create Branch → CASS (Story Writer) → NIGEL (Tester) → CLAUDE (Developer) → Commit → Create PR
```

Each screen gets its own feature branch (`feature/screen-{N}`), enabling **multiple Claude instances to work on different screens in parallel** without conflicts. The pipeline creates a PR at the end for human review before merging to main.

---

## The Agents

### Cass - Story Writer
- **Role**: Turns rough requirements into structured user stories with acceptance criteria
- **Input**: Rough description, screenshots, or design notes
- **Output**: `businessArtifacts/userstories/screen{N}.txt`
- **Skills**: `/user-story-writing`

### Nigel - Tester
- **Role**: Converts user stories into executable tests
- **Input**: User story from Cass
- **Output**:
  - Test artifacts in `prototype/test/artifacts/screen{N}/`
  - Executable tests in `prototype/test/routes/{screenName}.test.js`
  - Navigation helper in `prototype/test/helpers/sessionHelper.js`
- **Skills**: `/javascript-testing-patterns`

### Claude - Developer
- **Role**: Implements code to pass all tests
- **Input**: Tests and implementation guide from Nigel
- **Output**:
  - Implementation plan in `plans/screen{N}-plan.md`
  - Routes in `prototype/src/routes/claims.js`
  - Templates in `prototype/src/views/pages/claims/`
- **Skills**: `/javascript-expert`, `/modern-javascript-patterns`

---

## The Pipeline Skill: `/implement-screen`

A single command runs the entire workflow:

```bash
# Basic usage
/implement-screen 26

# With inline description
/implement-screen 26 "Screen for selecting Housing Act options"

# With pause gates for review
/implement-screen 26 --pause-after=cass
/implement-screen 26 --pause-after=nigel
/implement-screen 26 --pause-after=claude-plan

# Skip PR creation (commit only)
/implement-screen 26 --no-pr

# Batch multiple screens (each gets own branch)
/implement-screen 26,27,28

# Clean up merged branches
/implement-screen --cleanup
```

### Pipeline Steps

1. **Parse arguments** - Screen number, flags, inline input
2. **Create feature branch** - `feature/screen-{N}` for isolation
3. **Initialize queue** - Track progress in `.claude/implement-queue.json`
4. **Run Cass** - Create user story
5. **Run Nigel** - Create test artifacts and executable tests (4 sub-steps)
6. **Run Claude (Plan)** - Create implementation plan
7. **Run Claude (Implement)** - Write code until tests pass
8. **Commit and push** - Stage, commit, push to origin
9. **Create PR** - Open pull request for review
10. **Report status** - Summary with PR link
11. **Branch cleanup** - Auto-delete merged branches on next run

---

## Token Optimization

To avoid exceeding Claude's output token limits (4096 default), the pipeline is optimized:

### 1. Model Selection by Task Complexity

| Step | Agent | Model | Reason |
|------|-------|-------|--------|
| 4 | Cass | **haiku** | Simple text generation |
| 5a | Nigel | **haiku** | Understanding + test plan docs |
| 5b | Nigel | **haiku** | Behaviour matrix doc |
| 5c | Nigel | **haiku** | Implementation guide doc |
| 5d | Nigel | **sonnet** | Complex test code |
| 6 | Claude | **haiku** | Plan document |
| 7 | Claude | **sonnet** | Complex implementation |

**Result**: 5 of 7 steps use the faster, cheaper haiku model.

### 2. Breaking Large Tasks into Sequential Steps

Nigel's work was split from 1 large task into 4 focused tasks:

**Before (single task)**:
- Create understanding.md, test-plan.md, test-behaviour-matrix.md, implementation-guide.md, executable tests, and navigation helper
- Risk: Exceeds token limit

**After (4 sequential tasks)**:
- Step 5a: Understanding + test plan
- Step 5b: Behaviour matrix
- Step 5c: Implementation guide
- Step 5d: Executable tests + navigation helper

### 3. Output Constraints

Every prompt includes constraints:
```
OUTPUT CONSTRAINTS:
- Write ONLY the file contents
- No explanations or commentary
- Summary: X lines max
```

This prevents verbose responses that waste tokens.

### 4. Environment Variable

For additional headroom:
```bash
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=8192
```

---

## Queue System

Progress is tracked in `.claude/implement-queue.json`:

```json
{
  "lastUpdated": "2026-01-28T22:15:00Z",
  "cassQueue": [{"screenNumber": "28", "branch": "feature/screen-28"}],
  "nigelQueue": [{"screenNumber": "27", "branch": "feature/screen-27"}],
  "claudeQueue": [],
  "completed": [{"screenNumber": "26c", "branch": "feature/screen-26c", "prUrl": "https://..."}],
  "archived": [{"screenNumber": "25", "branch": "feature/screen-25", "mergedAt": "..."}],
  "failed": []
}
```

**Benefits**:
- Resume interrupted pipelines
- Batch processing (Cass works ahead while Nigel catches up)
- Visibility into what's queued and completed
- Track PRs and merged branches

---

## Pause Gates

Review work before proceeding:

| Flag | Pauses After |
|------|--------------|
| `--pause-after=cass` | User story created |
| `--pause-after=nigel` | Tests created |
| `--pause-after=claude-plan` | Implementation plan created |

---

## File Structure

```
possessions_prototype/
├── agentinstructions/
│   ├── AGENT_Cass.md          # Story writer instructions
│   ├── AGENT_TESTER.md        # Nigel's instructions
│   ├── AGENT_Developer.md     # Claude's instructions
│   └── DEVELOPMENT_RITUAL.md  # Overall process
├── .agents/skills/
│   ├── implement-screen/      # Pipeline automation skill
│   ├── user-story-writing/    # For Cass
│   ├── javascript-testing-patterns/  # For Nigel
│   ├── javascript-expert/     # For Claude
│   └── modern-javascript-patterns/   # For Claude
├── .claude/
│   ├── skills/                # Symlinks to .agents/skills
│   └── implement-queue.json   # Pipeline state
├── businessArtifacts/userstories/  # User stories (Cass output)
├── plans/                     # Implementation plans (Claude output)
└── prototype/
    ├── test/artifacts/        # Test artifacts (Nigel output)
    ├── test/routes/           # Executable tests (Nigel output)
    └── src/                   # Implementation (Claude output)
```

---

## Example Session

```bash
# Start the pipeline for Screen 26c
> /implement-screen 26c --pause-after=cass

# Creates branch feature/screen-26c
Created branch feature/screen-26c

# Cass asks for input
> "Screen for selecting Housing Act with 2 radio options for demotion of tenancy"

# Cass creates user story, pauses for review
# User reviews businessArtifacts/userstories/screen26c.txt
> Continue to Nigel

# Nigel creates tests (28 tests)
# Claude creates plan
# Claude implements
# Commits and pushes to feature/screen-26c
# Creates PR

## Pipeline Status
Completed: Screen 26c - Housing Act (Demotion) (28 tests)
PR: https://github.com/owner/repo/pull/123
Branch: feature/screen-26c

# Later, after PR is merged and you run another screen:
> /implement-screen 27
Cleaned up merged branches: feature/screen-26c
Created branch feature/screen-27
...
```

---

## Benefits

1. **Consistency** - Same process every time
2. **Quality** - Tests written before code (TDD)
3. **Traceability** - User story → Tests → Code all linked
4. **True parallelism** - Multiple Claude instances on different screens
5. **Safe merges** - PRs require human review before main changes
6. **CI integration** - Each PR triggers automated checks
7. **Reviewable** - Pause gates allow human oversight
8. **Resumable** - Queue persists across sessions
9. **Clean history** - Merged branches auto-deleted

---

## Running Parallel Pipelines

Each screen gets its own feature branch, so multiple Claude instances can work simultaneously:

```bash
# Terminal 1 - works on feature/screen-26
/implement-screen 26

# Terminal 2 - works on feature/screen-27
/implement-screen 27

# Terminal 3 - works on feature/screen-28
/implement-screen 28
```

**How it works**:
- Each instance creates/checks out its own branch (`feature/screen-{N}`)
- No file conflicts because branches are isolated
- Each completes with its own PR
- Review and merge PRs in any order
- Merged branches are auto-cleaned on next pipeline run

**Why branches instead of worktrees**:
- Simpler setup (no worktree management)
- Standard git workflow everyone understands
- PRs provide human review gate before merge
- CI runs on each PR
- No disk space multiplication

---

## Future Improvements

- **`/webapp-testing`** skill for automated browser verification
- **Progress dashboard** showing all pipeline states
- **Slack/webhook notifications** on completion
- **Auto-merge on CI pass** (optional, with `--auto-merge` flag)

---

## Questions?

This workflow was developed iteratively. For details on any agent or skill, see:
- `agentinstructions/AGENT_*.md` - Agent role definitions
- `.claude/skills/implement-screen/SKILL.md` - Full pipeline specification


## Options for packaging

There are a few approaches to package and distribute    
  Claude Code skills:                                     
                                                          
  Option 1: NPM Package (Recommended)                     
                                                          
  Create an npm package with a CLI that installs the      
  skill:                                                  
                                                          
  implement-feature-skill/                                
  ├── package.json                                        
  ├── bin/                                                
  │   └── install.js                                      
  └── skills/                                             
      └── implement-feature/                              
          └── SKILL.md                                    
                                                          
  package.json:                                           
  {                                                       
    "name": "@your-org/implement-feature-skill",          
    "version": "1.0.0",                                   
    "description": "Claude Code skill for implementing    
  features with Cass/Nigel/Claude pipeline",              
    "bin": {                                              
      "install-implement-feature": "./bin/install.js"     
    },                                                    
    "files": ["bin", "skills"]                            
  }                                                       
                                                          
  bin/install.js:                                         
  #!/usr/bin/env node                                     
  const fs = require('fs');                               
  const path = require('path');                           
                                                          
  const targetDir = path.join(process.cwd(), '.claude',   
  'skills', 'implement-feature');                         
  const sourceDir = path.join(__dirname, '..', 'skills',  
  'implement-feature');                                   
                                                          
  fs.mkdirSync(targetDir, { recursive: true });           
  fs.cpSync(sourceDir, targetDir, { recursive: true });   
                                                          
  console.log('✓ Installed implement-feature skill to     
  .claude/skills/');                                      
                                                          
  Usage:                                                  
  npx @your-org/implement-feature-skill                   
  # or                                                    
  npm install -g @your-org/implement-feature-skill        
  install-implement-feature                               
                                                          
  Option 2: GitHub Repo + degit                           
                                                          
  Host the skill in a GitHub repo and use degit to        
  install:                                                
                                                          
  npx degit your-org/implement-feature-skill/.claude/skill
  s/implement-feature .claude/skills/implement-feature    
                                                          
  Option 3: Simple Shell Script                           
                                                          
  Create a repo with an install script:                   
                                                          
  curl -fsSL https://raw.githubusercontent.com/your-org/im
  plement-feature-skill/main/install.sh | bash            
                                                          
  ---                                                     
  Would you like me to create the npm package structure   
  for you? I can set it up ready to publish.              
                                                          
❯ What files and other skills would need to be            
  included? The Agent.md files for example                
                                                          
● Great question. The implement-feature skill has several 
  dependencies that would need to be included or made     
  configurable:                                           
                                                          
  Current Dependencies                                    
                                                          
  1. Agent Instructions (required):                       
  agentinstructions/                                      
  ├── AGENT_Cass.md          # Story writer persona       
  ├── AGENT_TESTER.md        # Nigel tester persona       
  ├── AGENT_Developer.md     # Claude developer persona   
  └── DEVELOPMENT_RITUAL.md  # Overall workflow           
                                                          
  2. Directory Structure (project-specific):              
  businessArtifacts/userstories/     # User stories output
  prototype/test/artifacts/          # Test artifacts     
  prototype/test/routes/             # Test files         
  prototype/test/helpers/            # Session helpers    
  prototype/src/routes/              # Route              
  implementations                                         
  prototype/src/views/pages/claims/  # Templates          
  plans/                             # Implementation     
  plans                                                   
  .claude/implement-queue.json       # Queue state        
                                                          
  3. Reference Patterns (project-specific):               
  - Existing user stories as format examples              
  - Existing test files as patterns                       
  - Existing templates as patterns                        
  - GOV.UK Design System conventions                      
                                                          
  The Challenge                                           
                                                          
  The skill is currently tightly coupled to:              
  - This project's structure (Express + Nunjucks + GOV.UK)
  - This project's conventions (screen numbering, route   
  patterns)                                               
  - Existing files used as reference patterns             
                                                          
  Options for Packaging                                   
                                                          
  Option A: Full Starter Kit                              
  Package everything as a project template:               
  implement-feature-kit/                                  
  ├── .claude/skills/implement-feature/                   
  ├── agentinstructions/                                  
  │   ├── AGENT_Cass.md                                   
  │   ├── AGENT_TESTER.md                                 
  │   ├── AGENT_Developer.md                              
  │   └── DEVELOPMENT_RITUAL.md                           
  ├── businessArtifacts/userstories/.gitkeep              
  ├── plans/.gitkeep                                      
  └── example-patterns/           # Reference examples    
                                                          
  Option B: Configurable Skill                            
  Make paths configurable in the SKILL.md:                
  ---                                                     
  name: implement-feature                                 
  config:                                                 
    userStoriesDir: businessArtifacts/userstories         
    testArtifactsDir: test/artifacts                      
    routesFile: src/routes/index.js                       
    templatesDir: src/views                               
  ---                                                     
                                                          
  Option C: Generic + Project-Specific                    
  Split into:                                             
  1. Generic skill (the pipeline logic)                   
  2. Project adapter (paths, patterns, conventions)       
                                                          
  ---                                                     
  Which approach interests you? I can help:               
  1. Extract and package the current setup as a starter   
  kit                                                     
  2. Refactor the skill to be more configurable/generic   
  3. Document what needs customizing for other projects 
