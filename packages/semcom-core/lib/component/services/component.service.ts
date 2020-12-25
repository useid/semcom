import { Component } from '../models/component.model';

export abstract class ComponentService {
    public abstract all(): Promise<Component[]>;
}
