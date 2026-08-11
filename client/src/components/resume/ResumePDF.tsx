import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#3b82f6', pb: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  contact: { fontSize: 10, color: '#64748b', marginTop: 4 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6', borderBottom: 1, borderBottomColor: '#e2e8f0', pb: 4, mb: 10, textTransform: 'uppercase' },
  entry: { marginBottom: 12 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  entryTitle: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  entrySubtitle: { fontSize: 10, color: '#64748b' },
  entryDate: { fontSize: 10, color: '#94a3b8' },
  description: { fontSize: 10, color: '#475569', lineHeight: 1.5, marginTop: 4 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillBadge: { backgroundColor: '#f1f5f9', padding: '4 8', borderRadius: 4, fontSize: 9, color: '#475569' }
});

interface ResumePDFProps {
  data: any;
}

export const ResumePDF = ({ data }: ResumePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.firstName} {data.lastName}</Text>
        <Text style={styles.contact}>{data.email} | {data.phone} | {data.location}</Text>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text style={styles.description}>{data.content.summary}</Text>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {data.content.experience.map((exp: any, index: number) => (
          <View key={index} style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{exp.position}</Text>
              <Text style={styles.entryDate}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
            </View>
            <Text style={styles.entrySubtitle}>{exp.company}</Text>
            <Text style={styles.description}>{exp.description}</Text>
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {data.content.education.map((edu: any, index: number) => (
          <View key={index} style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{edu.degree} in {edu.field}</Text>
              <Text style={styles.entryDate}>{edu.graduationDate}</Text>
            </View>
            <Text style={styles.entrySubtitle}>{edu.institution}</Text>
          </View>
        ))}
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {data.content.skills.map((skill: string, index: number) => (
            <View key={index} style={styles.skillBadge}>
              <Text>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);