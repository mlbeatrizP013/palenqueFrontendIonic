import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { 
  storefront, 
  calendar, 
  home, 
  chatbubbles, 
  statsChart 
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,IonBadge], // 3. Esto ahora funcionará
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ 
      storefront,
      calendar,
      home,
      chatbubbles,
      statsChart
    });
  }
}