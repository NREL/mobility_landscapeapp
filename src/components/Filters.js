import React from 'react';
import { pure } from 'recompose';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import ProjectFilterContainer from './ProjectFilterContainer';
import LicenseFilterContainer from './LicenseFilterContainer';
import OrganizationFilterContainer from './OrganizationFilterContainer';
import HeadquartersFilterContainer from './HeadquartersFilterContainer';
import RegionFilterContainer from './RegionFilterContainer';
import Geo_scopeFilterContainer from './Geo_scopeFilterContainer';
import Item_typeFilterContainer from './Item_typeFilterContainer';
import Data_DurationFilterContainer from './Data_DurationFilterContainer';
import Data_FormatFilterContainer from './Data_FormatFilterContainer';
import Data_FrequencyFilterContainer from './Data_FrequencyFilterContainer';
import Data_OwnerFilterContainer from './Data_OwnerFilterContainer';
import LandscapeFilterContainer from './LandscapeFilterContainer';
import fields from '../types/fields';
const Filters = () => {
  return <div>
      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.landscape.label}</FormLabel>
          <LandscapeFilterContainer/>
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.relation.label}</FormLabel>
          <ProjectFilterContainer/>
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.license.label}</FormLabel>
          <LicenseFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.privacy.label}</FormLabel>
          <OrganizationFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.mode.label}</FormLabel>
          <HeadquartersFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.region.label}</FormLabel>
          <RegionFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.geo_scope.label}</FormLabel>
          <Geo_scopeFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.item_type.label}</FormLabel>
          <Item_typeFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.data_duration.label}</FormLabel>
          <Data_DurationFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.data_format.label}</FormLabel>
          <Data_FormatFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.data_frequency.label}</FormLabel>
          <Data_FrequencyFilterContainer />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">{fields.data_owner.label}</FormLabel>
          <Data_OwnerFilterContainer />
        </FormControl>
      </FormGroup> 

    </div>;
}
export default pure(Filters);
