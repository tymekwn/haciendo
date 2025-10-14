export type Priority = 1 | 2 | 3;

export class Task {
  id: number;
  dateCreated: Date;
  dateComplete?: Date;
  title: string;
  description?: string;
  priority: Priority;

  constructor(
    title: string,
    priority: Priority = 2,
    description?: string,
    id?: number,
    dateCreated?: Date,
    dateComplete?: Date
  ) {
    this.id = id ?? Date.now();
    this.dateCreated = dateCreated ?? new Date();
    this.dateComplete = dateComplete;
    this.title = title;
    this.description = description;
    this.priority = priority;
  }

  // Mark task as complete
  complete(): void {
    this.dateComplete = new Date();
  }

  // Check if task is completed
  isComplete(): boolean {
    return this.dateComplete !== undefined;
  }

  // Convert to plain object (useful for JSON serialization)
  toJSON(): object {
    return {
      id: this.id,
      dateCreated: this.dateCreated.toISOString(),
      dateComplete: this.dateComplete?.toISOString(),
      title: this.title,
      description: this.description,
      priority: this.priority
    };
  }

  // Create Task from plain object (useful for JSON deserialization)
  static fromJSON(json: any): Task {
    return new Task(
      json.title,
      json.priority,
      json.description,
      json.id,
      json.dateCreated ? new Date(json.dateCreated) : undefined,
      json.dateComplete ? new Date(json.dateComplete) : undefined
    );
  }
}