import styles from './buttons.module.css';

export default function PrimaryButton({ children, onClick, type = 'button' }) {
  return (
    <button className={styles.primary} onClick={onClick} type={type}>
      {children}
    </button>
  );
}