import { Component, Input, OnInit } from '@angular/core';
import { Subproduct } from '../../classes/subproduct';

@Component({
  selector: 'subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['./subproducts.component.scss']
})
export class SubproductsComponent implements OnInit {
  public components!: Array<Subproduct>;
  public bonuses!: Array<Subproduct>;

  ngOnInit() {
    this.components = [
      {
        title: 'Isometrics Mass Quick Start Video Guide',
        description: `
          <div>
              Getting started with a muscle-building program can be intimidating. Especially trying brand-new, powerful techniques 
              that will take your body and strength to the next level. And because you want to get started quickly and easily in minutes, 
              included are the Isometrics Mass Quick Start Video Guide.
          </div>

          <br>

          <div>
              This will show you exactly how to navigate through the program and begin using these fast-acting muscle and strength building 
              techniques for your very next workout. You’ll see just how easy it is to get started. No overwhelm. No confusion. Just a paint-by-numbers 
              guide to have you experiencing results moments from now.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Quick Start Video Guide',
          url: 'daec89e7c40b46b382dc923edcb120c4.png'
        },
        value: 0
      },


      {
        title: 'Isometrics Mass Instructional Video Library',
        description: `
          <div>
              With the Isometrics Mass Instructional Library you'll be shown exactly how to perform every single movement in the program. 
              Not only will this accelerate your muscle and strength gains, but it will ensure you’re performing each movement safely and 
              with confidence that you’re getting the most out of every single set and rep.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Instructional Video Library',
          url: '934f264eed7b4812905caf51b125eeb0.png'
        },
        value: 0
      }
    ]







    this.bonuses = [
      {
        title: 'Isometrics Mass Bodyweight Edition',
        description: `
          <div>
              Do you want to pile on pounds of mass using only your bodyweight? Fitness author and creator of Anabolic Running, 
              Joe LoGalbo, takes you through the Isometrics Mass Bodyweight Program. A bodyweight muscle-building routine you can 
              follow from anywhere to transform your physique.
          </div>

          <br>

          <div>
              No bands. No barbells. No gym. Simply follow these done-for-you workouts from home and build the strong and rock-solid 
              body that turns heads. These routines also act as a powerful “workout substitute” if you can’t make it to the gym, are a 
              frequent traveler, or you’re a bodyweight enthusiast who’d rather build dense muscle from your own living room.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Bodyweight Edition',
          url: '39269e7f4f214cfaa3c2727ff54c5191.png'
        },
        value: 99
      },


      {
        title: 'Isometrics Mass Done-For-You Meal Plan',
        description: `
          <div>
              Also included is a done-for-you meal plan to fuel your workouts, accelerate recovery, and help you pack on more muscle and 
              strength faster that you thought possible.
          </div>

          <br>

          <div>
              Every single meal is laid out in an easy-to-follow format to give you the easiest and shortest path to success.
          </div>

          <Br>

          <div>
              ​​​​Warning: If you’re someone who enjoys tiny meals, green salads at every sitting, and insane amounts of protein, this is 
              not the meal plan for you.
          </div>
        

          <br>

          <div>
              No worries, you can still enjoy the benefits of the Isometrics Mass program regardless of your nutrition preferences. 
              This is simply a proven tool to accelerate your results.
          </div>
        `,
        image: {
          name: 'Isometrics Mass Done-For-You Meal Plan',
          url: '39514aea540048ab8e41c83cfd8fe63b.png'
        },
        value: 999
      }
    ]
  }
}