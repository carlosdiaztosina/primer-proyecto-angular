import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDeteilsComponent } from './movie-deteils.component';

describe('MovieDeteilsComponent', () => {
  let component: MovieDeteilsComponent;
  let fixture: ComponentFixture<MovieDeteilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieDeteilsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDeteilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
