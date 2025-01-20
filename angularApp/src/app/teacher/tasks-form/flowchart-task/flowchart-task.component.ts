import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf, NgForOf } from '@angular/common';
import * as go from 'gojs';

@Component({
  selector: 'app-flowchart-task',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule],
  templateUrl: './flowchart-task.component.html',
  styleUrl: './flowchart-task.component.sass',
})
export class FlowchartTaskComponent implements AfterViewInit {
  taskName: string = ''; // Dynamischer Task-Name
  errorMessage: string = '';
  loading: boolean = false;
  type: string = '';
  category: string = '';
  skillLevel: string = '';
  hints: string[] = [''];
  description: string[] = ['', '', ''];
  feedback: string = '';
  codeTaskContent: string = '';
  solution: any = {}; // Lösung des Flowcharts

  public diagram!: go.Diagram;
  selectedShape: string = 'Start';
  selectedNodeKey: string = '';
  fromNodeKey: string = ''; 
  toNodeKey: string = ''; 
  public selectedLink: any = null;
  nodeName: string = '';
  linkText: string = '';

  
  constructor(
    private taskService: TaskService,
    private router: Router,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute

  ) {
    taskService.data$.subscribe((data) => {
      this.type = data.type;
      this.category = data.category;
      this.skillLevel = data.skill;
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.type = params['type'];
      this.category = params['category'];
      this.skillLevel = params['skill'];
      this.generateTaskTitle();
    });
  }

  generateTaskTitle(): void {
    this.loading = true;
    this.taskService.generateTaskTitle(this.category, this.type).subscribe({
      next: (response: { status: string; title: string; message?: string }) => {
        if (response.status === 'successful') {
          this.taskName = response.title;
        } else {
          this.errorMessage = response.message || 'Error generating task name.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching task name.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  save() {
    if (!this.diagram || !this.diagram.model) {
      alert('Diagram or model is not initialized.');
      return;
    }

    const taskDescription = [];
    taskDescription[0] = { text: this.description[0] || '' }; 
    taskDescription[1] = { code: this.codeTaskContent || '' }; 
  
    const nodeData = this.getNodeDataArray();
    const linkData = this.getLinkDataArray();
  
    // Task-Datenstruktur erstellen
    const task = {
      title: this.taskName,
      difficultyLevel: this.skillLevel,
      topic: this.category,
      type: this.type,
      description: taskDescription,
      hints: this.hints,
      points: 2,
      solution: { diagram: { nodes: nodeData, links: linkData } }, 
      feedback: this.feedback || '',
    };
  
    console.log('Saving task:', task);
  
    // Task an den Server senden
    this.taskService.createTask(task).subscribe({
      next: (response: { status: string; data: string; message?: string }) => {
        if (response.status === 'successful') {
          alert('Task successfully saved!');
          this.resetForm();
          this.router.navigate(['/teacher/tasks-overview']); // Zurück zur Übersicht navigieren
        } else {
          alert('Error creating task: ' + (response.message || 'Unknown error.'));
        }
      },
      error: (err: any) => {
        console.error('Error creating task:', err);
        alert('Error creating task.');
      },
    });
  }

  resetForm() {
    // Formular zurücksetzen
    this.taskName = '';
    this.description = ['', '', ''];
    this.hints = [''];
    this.codeTaskContent = '';
    this.solution = {};
    this.feedback = '';

    // Diagramm zurücksetzen
    if (this.diagram && this.diagram.model) {
      this.diagram.model = new go.GraphLinksModel();
    }
  }
  

  create() {
    let baseUrl = 'http://127.0.0.1:5000/';

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    this.httpClient
      .post(
        baseUrl + 'task',
        {
          difficultyLevel: this.skillLevel,
          topic: this.category,
          type: this.type,
        },
        { headers: headers }
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
  addHint(): void {
    this.hints.push('');
  }
  removeHint(index: number): void {
    this.hints.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngAfterViewInit(): void {
    this.initializeDiagram();
  
    if (!this.diagram) {
      console.error('Diagram failed to initialize.');
    } else {
      console.log('Diagram initialized:', this.diagram);
    }
  }
  
  
  initializeDiagram(): void {
    try {
      this.diagram = new go.Diagram('myDiagramDiv');
      console.log('Diagram initialized:', this.diagram);
  
      // Node and Link Templates here...
      // Node Template definieren
    this.diagram.nodeTemplateMap.add(
      'Default',
      go.GraphObject.make(go.Node, 'Auto',
        go.GraphObject.make(go.Shape, 'Ellipse', { fill: 'lightblue', width: 100, height: 50 }),
        go.GraphObject.make(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
      )
    );

      // Knoten-Vorlagen definieren
      this.diagram.nodeTemplateMap.add(
        'Start',
        new go.Node(go.Panel.Auto)
          .add(new go.Shape('Ellipse', { fill: 'lightgreen', width: 100, height: 50 }))
          .add(new go.TextBlock({ margin: 8 }).bind(new go.Binding('text', 'key')))
      );
      this.diagram.nodeTemplateMap.add(
        'Process',
        new go.Node(go.Panel.Auto)
          .add(new go.Shape('Rectangle', { fill: 'lightblue', width: 100, height: 50 }))
          .add(new go.TextBlock({ margin: 8 }).bind(new go.Binding('text', 'key')))
      );
      this.diagram.nodeTemplateMap.add(
        'Decision',
        new go.Node(go.Panel.Auto)
          .add(new go.Shape('Diamond', { fill: 'lightyellow', width: 100, height: 100 }))
          .add(new go.TextBlock({ margin: 8 }).bind(new go.Binding('text', 'key')))
      );
      this.diagram.nodeTemplateMap.add(
        'End',
        new go.Node(go.Panel.Auto)
          .add(new go.Shape('Ellipse', { fill: 'red', width: 100, height: 50 }))
          .add(new go.TextBlock({ margin: 8 }).bind(new go.Binding('text', 'key')))
      );

      // Link Template definieren
      this.diagram.linkTemplate = go.GraphObject.make(go.Link,
        { relinkableFrom: true, relinkableTo: true },
        go.GraphObject.make(go.Shape),
        go.GraphObject.make(go.Shape, { toArrow: 'Standard' }),
        go.GraphObject.make(go.TextBlock, { segmentOffset: new go.Point(0, -10) }, new go.Binding('text', 'text'))
      );
  
  
      this.diagram.model = new go.GraphLinksModel([], []);
      console.log('Model initialized:', this.diagram.model);
    } catch (error) {
      console.error('Error initializing diagram:', error);
    }
  }

  updateLinkText(link: any, newText: string): void {
    if (link && this.isGraphLinksModel(this.diagram.model)) {
      this.diagram.model.set(link, 'text', newText);
    }
  }
  
  startLinkDrawing(e: go.InputEvent, obj: go.GraphObject): void {
    const fromNode = obj?.part as go.Node | null;
    if (!fromNode || !fromNode.port) {
      console.error('Invalid fromNode or port is not available.');
      return;
    }
  
    const linkingTool = this.diagram.toolManager.linkingTool;
    linkingTool.startObject = fromNode.port; // Port überprüfen und setzen
    linkingTool.doActivate();
  }
  
  deleteNodeFromContextMenu(e: go.InputEvent, obj: go.GraphObject): void {
    const nodeToRemove = obj?.part?.data;
    if (!nodeToRemove || !(this.diagram.model instanceof go.GraphLinksModel)) {
      console.error('Invalid node or model.');
      return;
    }
    
    const model = this.diagram.model as go.GraphLinksModel;
    model.removeNodeData(nodeToRemove);
  }
  
  deleteLinkFromContextMenu(e: go.InputEvent, obj: go.GraphObject): void {
    const linkToRemove = obj?.part?.data;
    if (!linkToRemove || !(this.diagram.model instanceof go.GraphLinksModel)) {
      console.error('Invalid link or model.');
      return;
    }
    
    const model = this.diagram.model as go.GraphLinksModel;
    model.removeLinkData(linkToRemove);
  }
  

  initializePalette(): void {
    const palette = new go.Palette('paletteDiv');
  
    palette.nodeTemplateMap = this.diagram.nodeTemplateMap;
  
    palette.model = new go.GraphLinksModel([
      { key: 'Start', category: 'Default' },
      { key: 'Process', category: 'Default' },
      { key: 'Decision', category: 'Default' },
      { key: 'End', category: 'Default' }
    ]);
  }
  
  addNode(nodeName: string): void {
    if (!this.diagram || !this.diagram.model) {
      console.error('Diagram or model is not initialized.');
      return;
    }
  
    if (!nodeName || nodeName.trim() === '') {
      console.error('Node name cannot be empty.');
      return;
    }
  
    const newNode = { key: nodeName, category: this.selectedShape };
    (this.diagram.model as go.GraphLinksModel).addNodeData(newNode);
  }
  
  addRandomNode(): void {
    const categories = ['Start', 'Process', 'Decision', 'End'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomNode = {
      key: `Node ${this.diagram.model.nodeDataArray.length + 1}`,
      category: randomCategory,
    };
    (this.diagram.model as go.GraphLinksModel).addNodeData(randomNode);
  }

  deleteNode(): void {
    if (this.selectedNodeKey) {
      const model = this.diagram.model as go.GraphLinksModel;
      const nodeToRemove = model.findNodeDataForKey(this.selectedNodeKey);
      if (nodeToRemove) {
        model.removeNodeData(nodeToRemove);
        this.selectedNodeKey = ''; // Auswahl zurücksetzen
      }
    }
  }


  isGraphLinksModel(model: go.Model): model is go.GraphLinksModel {
    return model instanceof go.GraphLinksModel;
  }

  // Methode zum Löschen eines Links
  deleteLink(): void {
    if (!this.selectedLink || !this.isGraphLinksModel(this.diagram.model)) {
      console.error('No link selected or model is invalid.');
      return;
    }

    const model = this.diagram.model as go.GraphLinksModel;
    const linkToRemove = this.selectedLink;

    // Link entfernen
    model.removeLinkData(linkToRemove);
    console.log('Link deleted:', linkToRemove);

    // Auswahl zurücksetzen
    this.selectedLink = null;
  }

  // Link hinzufügen
  addLink(): void {
    if (this.fromNodeKey && this.toNodeKey && this.isGraphLinksModel(this.diagram.model)) {
      const newLink = { from: this.fromNodeKey, to: this.toNodeKey, text: this.linkText || '' };
      this.diagram.model.addLinkData(newLink);
      this.linkText = ''; // Eingabe zurücksetzen
    } else {
      console.error('Diagram model is not initialized or invalid.');
    }
  }
  
  // Holt die Knoten-Daten, wenn das Modell korrekt ist
getNodeDataArray(): Array<any> {
  if (this.diagram && this.diagram.model instanceof go.GraphLinksModel) {
    return this.diagram.model.nodeDataArray;
  }
  return [];
}

// Holt die Link-Daten, wenn das Modell korrekt ist
getLinkDataArray(): Array<any> {
  if (this.diagram && this.diagram.model instanceof go.GraphLinksModel) {
    return this.diagram.model.linkDataArray;
  }
  return [];
}

}
