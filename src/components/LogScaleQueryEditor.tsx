import React, { useEffect, useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { Select, QueryField } from '@grafana/ui';
import { DataSource } from '../DataSource';
import { LogScaleQuery } from './../types';

type Props = {
  datasource: DataSource;
  onChange: (q: LogScaleQuery) => void;
  runQuery: () => void;
  query: LogScaleQuery;
}

type Repository = {
  Name: string
};

export function LogScaleQueryEditor(props: Props) {
  const { datasource, query } = props;
  const [repositories, setRepositories] = useState(Array<SelectableValue<string>>);
  
  useEffect(() => {
    datasource.getResource('/repositories').then((result: Repository[]) => {
      const repositories = result.map(({ Name }) => ({ value: Name, label: Name }));
      setRepositories(prevRepositories => [...prevRepositories, ...repositories])
    });
  }, [datasource]);

    return (
      <div className="query-editor-row" can-collapse="true">
        <div className="gf-form gf-form--grow flex-shrink-1 min-width-15 explore-input-margin">
          <QueryField
            query={query.lsql}
            onChange={(val) => props.onChange({...props.query, lsql: val})}
            onBlur={props.runQuery}
            onRunQuery={props.runQuery}
            placeholder="Enter a LogScale query (run with Shift+Enter)"
            portalOrigin="LogScale"
          />
        </div>

        <Select
          width={30}
          options={repositories}
          value={props.query.repository}
          onChange={(val) => props.onChange({...props.query, repository: val.value!.toString()})}
        />
      </div>
    );
}
