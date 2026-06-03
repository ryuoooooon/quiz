using UnityEngine;

public class GameGridManager : MonoBehaviour
{
    public GameObject gridCellPrefab;  // 各マス目のPrefab（例: ボタンや画像）
    public Transform gridParent;      // グリッドを管理する親オブジェクト（空のGameObjectを指定）
    public int gridSize = 5;          // 5×5マス

    private GameObject[,] grid;       // 2D配列でマス目データを保持

    void Start()
    {
        GenerateGrid();
    }

    void GenerateGrid()
    {
        grid = new GameObject[gridSize, gridSize];

        for (int x = 0; x < gridSize; x++)
        {
            for (int y = 0; y < gridSize; y++)
            {
                // グリッドセルPrefabをインスタンス化
                GameObject cell = Instantiate(gridCellPrefab, gridParent);
                cell.name = $"Cell_{x}_{y}";

                // 配置の管理
                RectTransform rectTransform = cell.GetComponent<RectTransform>();
                rectTransform.anchoredPosition = new Vector2(x * 100, y * 100); // 位置調整

                // 2D配列に格納
                grid[x, y] = cell;

                // アイテム割り当て
                int itemType = Random.Range(0, 5); // 魔法瓶などのアイテムタイプ（0～4）
                cell.GetComponent<GridItem>().Initialize(itemType);
            }
        }
    }
}