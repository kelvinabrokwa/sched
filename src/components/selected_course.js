const SelectedCourse = ({ dept, level, sections, selectedSections, onSectionToggle }) => (<div>
  <div>
    {dept} {level}
  </div>
  <div>
    {sections && sections.keySeq().map(section => <div
      key={sections.getIn([section, 'dept']) + sections.getIn([section, 'level']) + sections.getIn([section, 'section'])}
    >
      <input
        type='radio'
        checked={selectedSections.includes(sections.getIn([section, 'section']))}
        onChange={onSectionToggle.bind(
          this,
          sections.getIn([section, 'dept']),
          sections.getIn([section, 'level']),
          sections.getIn([section, 'section'])
        )}
      />
        {sections.getIn([section, 'section'])}: {sections.getIn([section, 'meetDays']).join(',')} | {sections.getIn([section, 'meetTimes'])} | <a target='_blank' href={`http://www.ratemyprofessors.com/search.jsp?query=${sections.getIn([section, 'instructor'])}`}>{sections.getIn([section, 'instructor'])}</a>
    </div>)}
  </div>
</div>);

SelectedCourse.propTypes = {
  dept: React.PropTypes.string,
  level: React.PropTypes.string,
  sections: React.PropTypes.object,
  selectedSections: React.PropTypes.object,
  onToggleSection: React.PropTypes.func
};

export default SelectedCourse;
