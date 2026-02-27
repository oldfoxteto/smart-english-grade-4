// Knowledge Graph Implementation for Learning Engine
export interface KnowledgeNode {
  id: string;
  type: 'concept' | 'skill' | 'fact' | 'example' | 'rule' | 'vocabulary' | 'grammar';
  title: string;
  description: string;
  properties: {
    difficulty: number; // 1-10
    importance: number; // 1-10
    category: string;
    tags: string[];
    language: string;
    prerequisites: string[];
    relatedConcepts: string[];
  };
  content: {
    definition?: string;
    examples?: string[];
    explanation?: string;
    formula?: string;
    context?: string;
    multimedia?: {
      images?: string[];
      videos?: string[];
      audio?: string[];
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    contributor?: string;
    confidence: number; // 0-1
  };
}

export interface KnowledgeEdge {
  id: string;
  from: string;
  to: string;
  type: 'prerequisite' | 'related' | 'example' | 'application' | 'contradiction' | 'similarity';
  weight: number; // 1-10, strength of connection
  description: string;
  properties: {
    bidirectional?: boolean;
    conditional?: boolean; // Only applies under certain conditions
    temporal?: boolean; // Changes over time
  };
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  nodes: string[]; // Ordered sequence of nodes
  edges: string[]; // Connections between nodes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  learningObjectives: string[];
  adaptiveRules: {
    conditions: string[];
    actions: string[];
  };
}

export interface KnowledgeQuery {
  type: 'concept' | 'relationship' | 'path' | 'explanation' | 'example';
  query: string;
  context?: string;
  filters?: {
    difficulty?: number;
    category?: string;
    tags?: string[];
    language?: string;
  };
}

export interface KnowledgeSearchResult {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  paths: LearningPath[];
  suggestions: string[];
  totalResults: number;
}

class KnowledgeGraph {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private edges: Map<string, KnowledgeEdge> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();
  private adjacencyList: Map<string, string[]> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
    this.buildAdjacencyList();
  }

  // Initialize knowledge base with Grade 4 English content
  private initializeKnowledgeBase(): void {
    // Core concepts
    const concepts: KnowledgeNode[] = [
      {
        id: 'concept-language',
        type: 'concept',
        title: 'Language',
        description: 'English as a means of communication',
        properties: {
          difficulty: 1,
          importance: 10,
          category: 'fundamentals',
          tags: ['language', 'communication', 'basics'],
          language: 'en',
          prerequisites: [],
          relatedConcepts: ['grammar', 'vocabulary', 'pronunciation']
        },
        content: {
          definition: 'A system of communication that uses sounds, symbols, and grammar to convey meaning',
          explanation: 'Language has four main skills: listening, speaking, reading, and writing'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'concept-grammar',
        type: 'concept',
        title: 'Grammar',
        description: 'Rules and structure of language',
        properties: {
          difficulty: 3,
          importance: 9,
          category: 'structure',
          tags: ['grammar', 'rules', 'structure', 'syntax'],
          language: 'en',
          prerequisites: ['concept-language'],
          relatedConcepts: ['vocabulary', 'sentence-structure', 'parts-of-speech']
        },
        content: {
          definition: 'The system of rules that govern how words are combined to form sentences',
          explanation: 'Grammar includes syntax, parts of speech, and sentence structure'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'concept-vocabulary',
        type: 'concept',
        title: 'Vocabulary',
        description: 'Words and their meanings',
        properties: {
          difficulty: 2,
          importance: 8,
          category: 'content',
          tags: ['vocabulary', 'words', 'meaning', 'context'],
          language: 'en',
          prerequisites: ['concept-language'],
          relatedConcepts: ['grammar', 'context', 'usage']
        },
        content: {
          definition: 'The set of words known and used by a person or group',
          explanation: 'Vocabulary includes synonyms, antonyms, and usage patterns'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      }
    ];

    // Skills (procedural knowledge)
    const skills: KnowledgeNode[] = [
      {
        id: 'skill-reading-comprehension',
        type: 'skill',
        title: 'Reading Comprehension',
        description: 'Ability to understand written text',
        properties: {
          difficulty: 3,
          importance: 8,
          category: 'receptive',
          tags: ['reading', 'comprehension', 'understanding', 'analysis'],
          language: 'en',
          prerequisites: ['concept-vocabulary', 'concept-grammar'],
          relatedConcepts: ['context', 'main-idea', 'details', 'inference']
        },
        content: {
          definition: 'The process of extracting meaning from written text',
          explanation: 'Includes identifying main ideas, understanding vocabulary, and making inferences'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'skill-listening-comprehension',
        type: 'skill',
        title: 'Listening Comprehension',
        description: 'Ability to understand spoken English',
        properties: {
          difficulty: 4,
          importance: 8,
          category: 'receptive',
          tags: ['listening', 'comprehension', 'understanding', 'audio'],
          language: 'en',
          prerequisites: ['concept-vocabulary', 'concept-grammar', 'concept-language'],
          relatedConcepts: ['pronunciation', 'context', 'speaker-intent', 'details']
        },
        content: {
          definition: 'The process of understanding spoken English',
          explanation: 'Includes understanding different accents, speed, and identifying key information'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'skill-speaking-fluency',
        type: 'skill',
        title: 'Speaking Fluency',
        description: 'Ability to speak English clearly and naturally',
        properties: {
          difficulty: 5,
          importance: 9,
          category: 'productive',
          tags: ['speaking', 'fluency', 'pronunciation', 'communication'],
          language: 'en',
          prerequisites: ['concept-vocabulary', 'concept-grammar', 'skill-listening-comprehension'],
          relatedConcepts: ['pronunciation', 'rhythm', 'intonation', 'confidence']
        },
        content: {
          definition: 'The ability to speak English smoothly and confidently',
          explanation: 'Includes pronunciation, rhythm, stress, and natural conversation flow'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'skill-writing-composition',
        type: 'skill',
        title: 'Writing Composition',
        description: 'Ability to write clear and correct English',
        properties: {
          difficulty: 4,
          importance: 7,
          category: 'productive',
          tags: ['writing', 'composition', 'grammar', 'creativity'],
          language: 'en',
          prerequisites: ['concept-vocabulary', 'concept-grammar', 'skill-reading-comprehension'],
          relatedConcepts: ['sentence-structure', 'organization', 'style', 'clarity']
        },
        content: {
          definition: 'The ability to express ideas clearly in written English',
          explanation: 'Includes proper grammar, organization, and effective communication'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      }
    ];

    // Vocabulary items (declarative knowledge)
    const vocabulary: KnowledgeNode[] = [
      {
        id: 'vocab-noun-animal',
        type: 'vocabulary',
        title: 'Animals',
        description: 'Names of animals',
        properties: {
          difficulty: 1,
          importance: 7,
          category: 'nouns',
          tags: ['animals', 'nouns', 'grade4', 'vocabulary'],
          language: 'en',
          prerequisites: ['concept-vocabulary'],
          relatedConcepts: ['grammar-plurals', 'context-habitat', 'characteristics']
        },
        content: {
          definition: 'Words for animals',
          examples: ['cat', 'dog', 'elephant', 'lion', 'tiger'],
          explanation: 'Common animals that 4th graders learn'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'vocab-noun-food',
        type: 'vocabulary',
        title: 'Food',
        description: 'Names of food items',
        properties: {
          difficulty: 1,
          importance: 7,
          category: 'nouns',
          tags: ['food', 'nouns', 'grade4', 'vocabulary'],
          language: 'en',
          prerequisites: ['concept-vocabulary'],
          relatedConcepts: ['grammar-countable', 'context-meals', 'categories']
        },
        content: {
          definition: 'Words for food and drinks',
          examples: ['apple', 'banana', 'bread', 'milk', 'rice', 'water'],
          explanation: 'Essential vocabulary for daily life and nutrition'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'vocab-verb-basic',
        type: 'vocabulary',
        title: 'Basic Verbs',
        description: 'Common action words',
        properties: {
          difficulty: 2,
          importance: 9,
          category: 'verbs',
          tags: ['verbs', 'actions', 'grade4', 'vocabulary'],
          language: 'en',
          prerequisites: ['concept-vocabulary'],
          relatedConcepts: ['grammar-tenses', 'conjugation', 'sentence-structure']
        },
        content: {
          definition: 'Words that express actions or states of being',
          examples: ['go', 'come', 'eat', 'sleep', 'play', 'study', 'walk', 'run'],
          explanation: 'Essential verbs for everyday communication'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'vocab-adjective-basic',
        type: 'vocabulary',
        title: 'Basic Adjectives',
        description: 'Describing words',
        properties: {
          difficulty: 2,
          importance: 8,
          category: 'adjectives',
          tags: ['adjectives', 'describing', 'grade4', 'vocabulary'],
          language: 'en',
          prerequisites: ['concept-vocabulary'],
          relatedConcepts: ['grammar-comparison', 'modification', 'word-order']
        },
        content: {
          definition: 'Words that describe nouns, pronouns, and verbs',
          examples: ['big', 'small', 'happy', 'sad', 'fast', 'slow', 'hot', 'cold'],
          explanation: 'Adjectives help make descriptions more vivid and precise'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      }
    ];

    // Grammar rules
    const grammar: KnowledgeNode[] = [
      {
        id: 'grammar-sentence-structure-svo',
        type: 'rule',
        title: 'Subject-Verb-Object Structure',
        description: 'Basic English sentence structure',
        properties: {
          difficulty: 2,
          importance: 9,
          category: 'syntax',
          tags: ['grammar', 'syntax', 'sentence', 'structure'],
          language: 'en',
          prerequisites: ['concept-grammar'],
          relatedConcepts: ['parts-of-speech', 'word-order', 'clauses']
        },
        content: {
          definition: 'English sentences follow Subject-Verb-Object pattern',
          formula: 'Subject + Verb + Object',
          explanation: 'The subject performs the action, the verb shows the action, and the object receives the action'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'grammar-tense-present-simple',
        type: 'rule',
        title: 'Present Simple Tense',
        description: 'Actions happening now or regularly',
        properties: {
          difficulty: 2,
          importance: 8,
          category: 'tenses',
          tags: ['grammar', 'tenses', 'verbs', 'syntax'],
          language: 'en',
          prerequisites: ['concept-grammar'],
          relatedConcepts: ['verb-conjugation', 'time-expressions', 'frequency-adverbs']
        },
        content: {
          definition: 'Used for actions happening now or regular repeated actions',
          formula: 'Subject + base form of verb (+s/es for he/she/it)',
          examples: ['I play football', 'She reads books', 'They go to school'],
          explanation: 'Most common tense for beginners'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      },
      {
        id: 'grammar-noun-plurals-regular',
        type: 'rule',
        title: 'Regular Plurals',
        description: 'Making nouns plural',
        properties: {
          difficulty: 2,
          importance: 7,
          category: 'morphology',
          tags: ['grammar', 'plurals', 'nouns', 'morphology'],
          language: 'en',
          prerequisites: ['concept-grammar'],
          relatedConcepts: ['countable-uncountable', 'irregular-plurals']
        },
        content: {
          definition: 'Regular plural formation rules',
          formula: 'Add -s or -es to most nouns',
          examples: ['cat → cats', 'dog → dogs', 'class → classes', 'box → boxes'],
          explanation: 'Most English nouns form plurals by adding -s'
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          confidence: 1.0
        }
      }
    ];

    // Add all nodes to the graph
    [...concepts, ...skills, ...vocabulary, ...grammar].forEach(node => {
      this.nodes.set(node.id, node);
    });

    // Create edges (relationships)
    const edges: KnowledgeEdge[] = [
      // Concept relationships
      { id: 'edge-lang-grammar', from: 'concept-language', to: 'concept-grammar', type: 'related', weight: 10, description: 'Language includes grammar rules' },
      { id: 'edge-grammar-vocab', from: 'concept-grammar', to: 'concept-vocabulary', type: 'related', weight: 9, description: 'Grammar governs vocabulary usage' },
      
      // Skill prerequisites
      { id: 'edge-reading-vocab', from: 'concept-vocabulary', to: 'skill-reading-comprehension', type: 'prerequisite', weight: 8, description: 'Vocabulary needed for reading' },
      { id: 'edge-listening-vocab', from: 'concept-vocabulary', to: 'skill-listening-comprehension', type: 'prerequisite', weight: 8, description: 'Vocabulary needed for listening' },
      { id: 'edge-speaking-vocab', from: 'concept-vocabulary', to: 'skill-speaking-fluency', type: 'prerequisite', weight: 9, description: 'Vocabulary essential for speaking' },
      { id: 'edge-writing-vocab', from: 'concept-vocabulary', to: 'skill-writing-composition', type: 'prerequisite', weight: 7, description: 'Vocabulary needed for writing' },
      
      // Grammar dependencies
      { id: 'edge-structure-verbs', from: 'concept-grammar', to: 'skill-reading-comprehension', type: 'prerequisite', weight: 9, description: 'Grammar structure aids reading' },
      { id: 'edge-structure-writing', from: 'concept-grammar', to: 'skill-writing-composition', type: 'prerequisite', weight: 8, description: 'Grammar essential for writing' },
      { id: 'edge-tenses-speaking', from: 'grammar-tense-present-simple', to: 'skill-speaking-fluency', type: 'application', weight: 7, description: 'Present tense used in conversation' },
      
      // Skill dependencies
      { id: 'edge-reading-writing', from: 'skill-reading-comprehension', to: 'skill-writing-composition', type: 'prerequisite', weight: 6, description: 'Reading comprehension improves writing' },
      { id: 'edge-listening-speaking', from: 'skill-listening-comprehension', to: 'skill-speaking-fluency', type: 'prerequisite', weight: 8, description: 'Listening comprehension supports speaking' }
    ];

    edges.forEach(edge => {
      this.edges.set(edge.id, edge);
    });
  }

  // Build adjacency list for graph traversal
  private buildAdjacencyList(): void {
    this.nodes.forEach((node, nodeId) => {
      const connections = this.edges.get(nodeId);
      if (connections) {
        const adjacentNodes = connections
          .filter(edge => edge.from === nodeId)
          .map(edge => edge.to);
        this.adjacencyList.set(nodeId, adjacentNodes);
      }
    });
  }

  // Public API methods
  addNode(node: KnowledgeNode): void {
    this.nodes.set(node.id, node);
    this.buildAdjacencyList();
  }

  addEdge(edge: KnowledgeEdge): void {
    this.edges.set(edge.id, edge);
    this.buildAdjacencyList();
  }

  getNode(nodeId: string): KnowledgeNode | undefined {
    return this.nodes.get(nodeId);
  }

  getAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): KnowledgeEdge[] {
    return Array.from(this.edges.values());
  }

  // Search functionality
  search(query: KnowledgeQuery): KnowledgeSearchResult {
    const results: KnowledgeNode[] = [];
    const matchedEdges: KnowledgeEdge[] = [];
    const paths: LearningPath[] = [];
    const suggestions: string[] = [];

    // Search nodes
    this.nodes.forEach((node, nodeId) => {
      let matches = false;
      
      // Check if node matches query
      if (query.type === 'concept') {
        matches = node.type === 'concept' && 
                  node.title.toLowerCase().includes(query.query.toLowerCase()) &&
                  this.matchesFilters(node, query.filters);
      } else if (query.type === 'skill') {
        matches = node.type === 'skill' && 
                  node.title.toLowerCase().includes(query.query.toLowerCase()) &&
                  this.matchesFilters(node, query.filters);
      } else if (query.type === 'vocabulary') {
        matches = node.type === 'vocabulary' && 
                  node.title.toLowerCase().includes(query.query.toLowerCase()) &&
                  this.matchesFilters(node, query.filters);
      }

      if (matches) {
        results.push(node);
      }
    });

    // Search edges
    if (query.type === 'relationship') {
      this.edges.forEach(edge => {
        if (edge.description.toLowerCase().includes(query.query.toLowerCase())) {
          matchedEdges.push(edge);
        }
      });
    }

    // Generate suggestions based on search
    if (results.length === 0) {
      suggestions.push('Try different search terms');
      suggestions.push('Check spelling');
      suggestions.push('Use broader categories');
    } else if (results.length < 5) {
      suggestions.push('Consider related concepts');
      suggestions.push('Explore different categories');
    }

    return {
      nodes: results,
      edges: matchedEdges,
      paths,
      suggestions,
      totalResults: results.length
    };
  }

  // Helper method to check if node matches filters
  private matchesFilters(node: KnowledgeNode, filters?: any): boolean {
    if (!filters) return true;
    
    if (filters.difficulty && node.properties.difficulty > filters.difficulty) return false;
    if (filters.category && !node.properties.category.includes(filters.category)) return false;
    if (filters.tags && !filters.tags.some((tag: string) => node.properties.tags.includes(tag))) return false;
    
    return true;
  }

  // Find shortest path between two nodes
  findShortestPath(fromId: string, toId: string): string[] | null {
    const visited = new Set();
    const queue: { node: string; path: string[] }[] = [];
    
    queue.push({ node: fromId, path: [fromId] });
    visited.add(fromId);

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      
      if (node === toId) {
        return path;
      }
      
      const connections = this.edges.get(node) || [];
      const adjacentNodes = connections
        .filter(edge => edge.from === node)
        .map(edge => edge.to)
        .filter(adjacentNode => !visited.has(adjacentNode));

      adjacentNodes.forEach(adjacentNode => {
        if (!visited.has(adjacentNode)) {
          visited.add(adjacentNode);
          queue.push({ node: adjacentNode, path: [...path, adjacentNode] });
        }
      });
    }

    return null;
  }

  // Get related concepts
  getRelatedConcepts(nodeId: string, maxDepth: number = 2): KnowledgeNode[] {
    const visited = new Set();
    const related: KnowledgeNode[] = [];
    const queue: string[] = [nodeId];

    while (queue.length > 0 && related.length < 20) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      const currentNode = this.getNode(currentId);
      if (currentNode) {
        related.push(currentNode);
        
        // Add related concepts
        currentNode.properties.relatedConcepts.forEach(relatedId => {
          if (!visited.has(relatedId) && related.length < 20) {
            queue.push(relatedId);
          }
        });
      }
    }

    return related;
  }

  // Generate learning path
  generateLearningPath(startId: string, endId: string): LearningPath | null {
    const path = this.findShortestPath(startId, endId);
    if (!path) return null;

    const startNode = this.getNode(startId);
    const endNode = this.getNode(endId);
    
    if (!startNode || !endNode) return null;

    return {
      id: `path-${startId}-${endId}`,
      name: `Learning Path: ${startNode.title} to ${endNode.title}`,
      description: `Optimal path from ${startNode.title} to ${endNode.title}`,
      nodes: path,
      edges: path.slice(0, -1).map((nodeId, index) => {
        const from = path[index];
        const to = path[index + 1];
        const edge = Array.from(this.edges.values()).find(e => e.from === from && e.to === to);
        return edge?.id || `${from}-${to}`;
      }),
      difficulty: this.calculatePathDifficulty(path),
      estimatedTime: this.calculatePathTime(path),
      learningObjectives: this.generatePathObjectives(path),
      adaptiveRules: {
        conditions: ['Complete each skill before moving to next'],
        actions: ['Review prerequisites if stuck', 'Practice weak areas', 'Take assessments']
      }
    };
  }

  // Calculate path difficulty
  private calculatePathDifficulty(path: string[]): 'beginner' | 'intermediate' | 'advanced' {
    const difficulties = path.map(nodeId => {
      const node = this.getNode(nodeId);
      return node?.properties.difficulty || 5;
    });

    const avgDifficulty = difficulties.reduce((sum, diff) => sum + diff, 0) / difficulties.length;
    
    if (avgDifficulty <= 2) return 'beginner';
    if (avgDifficulty <= 4) return 'intermediate';
    return 'advanced';
  }

  // Calculate estimated time for path
  private calculatePathTime(path: string[]): number {
    return path.reduce((total, nodeId) => {
      const node = this.getNode(nodeId);
      return total + (node?.metadata.estimatedTime || 30);
    }, 0);
  }

  // Generate learning objectives for path
  private generatePathObjectives(path: string[]): string[] {
    return path.map(nodeId => {
      const node = this.getNode(nodeId);
      return node?.content.explanation || `Master ${node.title}`;
    });
  }

  // Get knowledge graph statistics
  getStatistics(): {
    totalNodes: number;
    totalEdges: number;
    nodesByType: Record<string, number>;
    nodesByCategory: Record<string, number>;
    averageDifficulty: number;
    mostConnectedNodes: Array<{ id: string; connections: number }>;
  } {
    const nodes = Array.from(this.nodes.values());
    const edges = Array.from(this.edges.values());

    const nodesByType: Record<string, number> = {};
    const nodesByCategory: Record<string, number> = {};
    
    nodes.forEach(node => {
      nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
      node.properties.category.split(', ').forEach(category => {
        nodesByCategory[category.trim()] = (nodesByCategory[category.trim()] || 0) + 1;
      });
    });

    const connections = new Map<string, number>();
    edges.forEach(edge => {
      connections.set(edge.from, (connections.get(edge.from) || 0) + 1);
      connections.set(edge.to, (connections.get(edge.to) || 0) + 1);
    });

    const mostConnectedNodes = Array.from(connections.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([nodeId, count]) => ({ id: nodeId, connections: count }));

    const averageDifficulty = nodes.reduce((sum, node) => sum + node.properties.difficulty, 0) / nodes.length;

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodesByType,
      nodesByCategory,
      averageDifficulty,
      mostConnectedNodes
    };
  }
}

export default KnowledgeGraph;
export type { KnowledgeNode, KnowledgeEdge, LearningPath, KnowledgeQuery, KnowledgeSearchResult };
