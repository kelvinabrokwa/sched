const SelectedCourse = ({ dept, level, sections, selectedSections, onSectionToggle }) => (<div>
  <div>
    {dept} {level}
  </div>
  <div>
    {sections && sections.map(section => <div
      key={section.get('dept') + section.get('level') + section.get('section')}
    >
      <input
        type='radio'
        checked={selectedSections.includes(section.get('section'))}
        onChange={onSectionToggle.bind(
          this,
          section.get('dept'),
          section.get('level'),
          section.get('section')
        )}
      />
        {section.get('section')}: {section.get('meetDays').join(',')} {section.get('meetTimes')}
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
