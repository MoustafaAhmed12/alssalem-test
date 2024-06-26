import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { ImportantCateogryComponent } from './components/important-cateogry/important-cateogry.component';
import { PackageSectionComponent } from './components/package-section/package-section.component';
import { OpinionsComponent } from './components/opinions/opinions.component';
import { SuccessPartnersComponent } from './components/success-partners/success-partners.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    ImportantCateogryComponent,
    PackageSectionComponent,
    OpinionsComponent,
    SuccessPartnersComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
