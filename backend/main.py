from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineData(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]

def is_dag(nodes, edges):
    # Build adjacency list
    adj = {node['id']: [] for node in nodes}
    in_degree = {node['id']: 0 for node in nodes}
    
    for edge in edges:
        source = edge['source']
        target = edge['target']
        if source in adj and target in adj: # Ensure nodes exist
            adj[source].append(target)
            in_degree[target] += 1
            
    # Kahn's Algorithm
    queue = [node_id for node_id in in_degree if in_degree[node_id] == 0]
    visited_count = 0
    
    while queue:
        u = queue.pop(0)
        visited_count += 1
        
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
                
    return visited_count == len(nodes)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineData):
    # Convert lists to internal structures
    nodes = {node['id']: node for node in pipeline.nodes}
    edges = pipeline.edges
    
    # Build adjacency list
    adj = {node_id: [] for node_id in nodes}
    for edge in edges:
        source = edge['source']
        target = edge['target']
        if source in adj and target in adj:
            adj[source].append(target)
            
    # DFS for Cycle Detection
    visited = set()
    recursion_stack = set()
    cyclic_nodes = set()
    cyclic_edges = set()
    
    def dfs(u, path_nodes):
        visited.add(u)
        recursion_stack.add(u)
        path_nodes.append(u)
        
        has_cycle = False
        
        for v in adj[u]:
            if v not in visited:
                if dfs(v, path_nodes):
                    has_cycle = True
            elif v in recursion_stack:
                # Cycle detected!
                has_cycle = True
                
                # Identify cycle path
                try:
                    cycle_start_index = path_nodes.index(v)
                    cycle_path = path_nodes[cycle_start_index:]
                    
                    # Add nodes involved in this cycle
                    for node in cycle_path:
                        cyclic_nodes.add(node)
                    
                    # Add edges involved in this cycle
                    # The edge u -> v closes the cycle
                    # Plus all edges between nodes in the cycle path
                    
                    # Add closing edge
                    closing_edge = next((e['id'] for e in edges if e['source'] == u and e['target'] == v), None)
                    if closing_edge:
                        cyclic_edges.add(closing_edge)
                        
                    # Add path edges
                    for i in range(len(cycle_path) - 1):
                        src = cycle_path[i]
                        tgt = cycle_path[i+1]
                        edge_id = next((e['id'] for e in edges if e['source'] == src and e['target'] == tgt), None)
                        if edge_id:
                            cyclic_edges.add(edge_id)
                            
                except ValueError:
                    pass
        
        recursion_stack.remove(u)
        path_nodes.pop()
        return has_cycle

    # Run DFS from each unvisited node
    is_dag = True
    for node_id in nodes:
        if node_id not in visited:
            if dfs(node_id, []):
                is_dag = False
    
    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag": is_dag,
        "cyclic_nodes": list(cyclic_nodes),
        "cyclic_edges": list(cyclic_edges)
    }